// ********************************* Display of clonotype tree for a given clone ****************************************************


function generateCircularTree(dataTree){

  d3.select("#clonotypeTree svg").remove();
  dataClonotypes = dataTree;

  var clonotypeTooltip = d3.select("#clonotypeTree").append("div")
                      .attr("class","tooltip");

  var branchLength = document.getElementById("branchLength"); // checkbox element to display the length of the branch
  var width = document.getElementById("clonotypeTree").offsetWidth,
      height = document.getElementById("clonotypeTree").offsetHeight;

  var data = d3.hierarchy(dataTree, function(d) { return d.children; })
         .sum(function(d) { return d.children ? 0 : 1; })
         .sort(function(a, b) { return (a.value - b.value) || d3.ascending(a.data.length, b.data.length); }); //data structure that represente a hieratchy

      //create the svg object and the layout depending on the form of the tree
  //set the dimensions and margins of the diagram
  var margin = {top: 10, right: 5, bottom: 10, left: 5};
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

  //add an svg object
  var svg2 = d3.select("#clonotypeTree").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
         .append("g")
          .attr("transform", "translate(" + width/2 +','+ height/2 + ")");

  //declares a tree layout and assigns the size
  var tree = d3.cluster()	//creating the tree layout 
          .size([2 * Math.PI, height/2])
          .separation(function(a, b) { return ((a.depth >= 2) && (b.depth >= 2)) ? 1 : 4; });

  //parameters use to collapse the tree       
  var duration = 0, i=0;
      data.x0 = height / 2;
      data.y0 = 0;

  updateTree(data);

  function updateTree(source) {

    //assign properties to the data (coordinates, depth, ...)
    var root = tree(data);
    var maxLength = getMaxLength(root)

    if(branchLength.checked){
      setRadius(root, root.data.length = 0, ((height - margin.top - margin.bottom)/2) / maxLength[1], false);
    }else{
      setRadius(root, root.data.length = 0, ((height - margin.top - margin.bottom)/2) / maxLength[0], true);
    }

    // Compute the new tree layout.
    var nodes = root.descendants(),
    links = root.descendants().slice(1);

    //Nodes
    //add each node as a group
    var node = svg2.selectAll('g.nodeTree')
            .data(nodes, function(d) {return d.id || (d.id = ++i); });

    //add new nodes at the parent's previous position
    var nodeEnter = node.enter().append('g')
                 .attr('class', 'nodeTree')
                 .attr("transform", function(d) { return "translate(" + radialPoint(source.x0, source.y0) + ")"; })	//position the nodes
                 .on('click', changeChildren)
                 .on("mousemove",function(d){ if(d.data.color!="#FFFFFF" && d.data.name!="naive"){ return showClonotype(d); } })
                 .on("mouseout",hideClonotype);

    // adds the circle to the node
    nodeEnter.append("path")
             .attr('class', 'nodeTree')
             .style("fill", function(d){  return d.data.color; })
             .style("stroke", "#000000")
             .style("stroke-dasharray", function(d){ return d.data.style })
             .attr("d", d3.symbol().size(function(d) { if(d.data.color=="#FFFFFF"){ return 60;
                                                     }else if(d.data.value>80){return 300;
                                                     }else if(d._children){ return 200; 
                                                     }else{ return 100; } })
                                   .type(function(d) { if(d.data.name=="naive"){return d3.symbolTriangle;
                                                     }else if(d._children){return d3.symbolCross;
                                                     }else if(d.data.value>80){return d3.symbolSquare;
                                                     }else{return d3.symbolCircle;}
                                                     }));

    //update node
    var nodeUpdate = nodeEnter.merge(node);

    //transition to the proper position for the node
    nodeUpdate.transition().duration(duration)
              .attr("transform", function(d) { return "translate(" + radialPoint(d.x, d.radius) + ")"; });

    nodeUpdate.select('path.nodeTree')
              .style("stroke", "#000000")
              .attr("d", d3.symbol().size(function(d) { if(d.data.color=="#FFFFFF"){ return 60;
                                                      }else if(d.data.value>80){return 300;
                                                      }else if(d._children){ return 200; 
                                                      }else{ return 100; } })
                                    .type(function(d) { if(d.data.name=="naive"){return d3.symbolTriangle;
                                                      }else if(d._children){return d3.symbolCross;
                                                      }else if(d.data.value>80){return d3.symbolSquare;
                                                      }else{return d3.symbolCircle;}
                                                      }))
              .attr('cursor', 'pointer');

    //remove any exiting nodes
    var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + radialPoint(source.x, source.radius) + ")"; })
                .remove();

    //reduce the node circles size to 0
    nodeExit.select('path.nodeTree').attr("d", d3.symbol().size(0));

    //Links
    //add the links between the nodes
    var link = svg2.selectAll("path.linkTree").data(links, function(d) { return d.id; });
  
    var linkEnter = link.enter().insert('path',"g")	//SVG path allow to draw shape
                 .attr("class", "linkTree")
                 .attr("fill", "none")
                 .style("stroke", "#555")
                 .attr("d", function(d){ var s = {x : source.x0, y : source.radius}; return branchShape(s, s);});

    //update link
    var linkUpdate = linkEnter.merge(link);

    //transition back to the parent element position
    linkUpdate.transition()
              .duration(duration)
              .attr("d", function(d){ var s = {x : d.x, y : d.radius}, t = {x : d.parent.x, y : d.parent.radius}; return branchShape(s, t); });

    //remove any exiting links
    var linkExit = link.exit().transition()
                .duration(duration)
                .attr("d", function(d){ var s = {x : source.x, y : source.radius}; return branchShape(s, s);})
                .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){ d.x0 = d.x; d.y0 = d.radius;});

  }

  function changeChildren(d){
    if(d.children){
      d._children = d.children;
      d.children = null;
    }else{
      d.children = d._children;
      d._children = null;
    }
    updateTree(d);
  }
  
    //tooltip
  function showClonotype(d) {
    clonotypeTooltip.style("left", ((d3.event.pageX + 10)+"px"))
                    .style("top", ((d3.event.pageY + 15)+"px"))
                    .style('display', 'inline-block')
                    .html("Name : "+d.data.name + "<br> Abundance : "+ Math.round(d.data.value*100) / 100 + "%<br>Length : "+ d.data.length);
  }

  function hideClonotype() {
    clonotypeTooltip.style('display', 'none');
  }
}

/* ****************************************** functions used to visualize the tree ************************************************ */

function radialPoint(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

//give the start and end point to a branch    
function branchShape(s,t) {
  return "M" + radialPoint(t.x, t.y)[0] + "," + radialPoint(t.x, t.y)[1] + (t.x === s.x ? "" : "A" + t.y + "," + t.y + " 0 0 " + (s.x > t.x ? 1 : 0) + " " + radialPoint(s.x, t.y)[0] + "," + radialPoint(s.x, t.y)[1]) + "L" + radialPoint(s.x, s.y)[0] + "," + radialPoint(s.x, s.y)[1]; //M means move to
//return "M" + radialPoint(s.x, s.y)[0] + "," + radialPoint(s.x, s.y)[1] + " " + radialPoint(t.x, t.y)[0] + "," + radialPoint(t.x, t.y)[1];
}

function getMaxLength(node) {
  var maxLength = [0,0], branchLength = [], sameLength = [];
  for(var i in node.children){
    if(node.children[i].children){
      maxLength = getMaxLength(node.children[i]);
      sameLength.push(maxLength[0]+1);
      branchLength.push(maxLength[1]+parseFloat(node.children[i].data.length));
    }else{
      sameLength.push(1);
      branchLength.push(parseFloat(node.children[i].data.length));
    }
  }
  for(var j in sameLength){
    if(sameLength[j]>maxLength[0]){
      maxLength[0] = sameLength[j];
    }
  }
  for(var h in branchLength){
    if(branchLength[h]>maxLength[1]){
      maxLength[1] = branchLength[h];
    }
  }
  return maxLength;
}

//set the radius of each node by summing and scaling the distance
function setRadius(d, y0, k, sameLength) {
  //all the branches have the same length : 1
  if(sameLength){
    if(d.data.name!="naive"){
      d.radius = (y0 += 1) * k;
    }else{
      d.radius = y0 * k;
    }
  }else{
    d.radius = (y0 += parseFloat(d.data.length)) * k;
  }
  if (d.children) d.children.forEach(function(d) { setRadius(d, y0, k, sameLength); });
}

function displayTreeModification(){
  generateCircularTree(dataClonotypes);
}

function message(error) {
  alert("Error : "+error);
}
