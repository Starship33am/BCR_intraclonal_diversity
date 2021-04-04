// ********************************* Display of clonotype tree for a given clone ****************************************************

function displayTree(){
  d3.select("#clonotypeTree svg").remove();
  var colorProd = document.getElementById("productivity"); // checkbox element
  var treeBranches = [], maxAbundance=0; 
  
  cloneName = objectSelected[0]["name"].split("-")[0];
  localStorage.setItem( 'clone', cloneName );

  //CAUTOUS : call the tool for analyse the intraclonal heterogeneity

  var user = cookies["Userfile"],
      file = user +"_"+cloneName+"_clonotype.json";
      path = "pipeline/usersFiles/"+user+"/tree/"+file;

  //loading the json file
  d3.json(path, function(error, dataTree) {
    if (error) throw error;

    var data = d3.hierarchy(dataTree); //data structure that represente a hieratchy

    //store the most abundant clonotypes and the value of the longest branch of the tree
    treeBranches = findMostAbundantClonotypes(data); 

    //create the svg object and the layout depending on the form of the tree
    //set the dimensions and margins of the diagram
    var margin = {top: 20, right: 10, bottom: 20, left: 10},
        width = (document.getElementById('chart2').offsetWidth) - margin.left - margin.right,
        height = (document.getElementById('chart2').offsetHeight) - margin.top - margin.bottom;

    //add an svg object to the chart2 element
    var svg2 = d3.select("#clonotypeTree").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + width/2 +','+ height/2 + ")");

    // declares a tree layout and assigns the size
    var tree = d3.tree()	//creating the tree layout 
            .size([2 * Math.PI, height/2])
            .separation(function(a, b) { return ((a.depth >= 2) && (b.depth >= 2)) ? 1 : 4; });

    //parameters use to collapse the tree       
    var duration = 750, i=0;
    data.x0 = height / 2;
    data.y0 = 0;

    var maxSizeNode = width/(data.leaves().length+1), 
        minSizeNode = (width/(data.leaves().length+1))*0.9,
        //maxSizeNode = Math.min(maxSizeWidth,maxSizeHeight)
        nodeSizeFactor = (maxSizeNode-minSizeNode)/treeBranches[3],  //abundance scale unit
        yUnit = (height-((treeBranches[2]*nodeSizeFactor)+minSizeNode))/treeBranches[1];  //value of a nucleotide in pixel

    updateTree(data);

    function updateTree(source) {

      //assign properties to the data (coordinates, depth, ...)
      var root = tree(data);

      // Compute the new tree layout.
      var nodes = root.descendants(),
      links = root.descendants().slice(1);

      // ********* Creation of the nodes *********

      //add each node as a group
      var node = svg2.selectAll('g.nodeTree')
              .data(nodes, function(d) {return d.id || (d.id = ++i); });

      //add new nodes at the parent's previous position
      var nodeEnter = node.enter().append('g')
                  .attr('class', 'nodeTree')
                  .attr("transform", function(d) { return "translate(" + radialPoint(source.x0, source.y0) + ")"; })	//position the nodes
                  .on('click', changeChildren)
                  .on("mouseover", function(d) { var g = d3.select(this); //g object of the node
                                                 var info = g.append('text').classed('info', true).attr('x', -25).attr('y', function(d) { return -(10+(d.data.value*0.1))}).text(function(d) { if(d.data.name!="ighv"){ return d.data.name; }}).attr('font-size', 12) ;})
                  .on("mouseout", function() { d3.select(this).select('text.info').remove()}); //remove the text on mouse out

      // adds the circle to the node
      nodeEnter.append("path")
               .attr('class', 'nodeTree')
               .style("fill", function(d){if(colorProd.checked){ 
                                            if(d.data.productivity=="yes"){ return "#28b463";}
                                            else if(d.data.productivity=="no"){ return "#e74c3c";}
                                            else{ return "#999999";}
                                          }else{return d.data.color;}})
               .style("stroke", function(d){ if(colorProd.checked){return "#000000";}else{return d.data.stroke;} })
               .style("stroke-dasharray", function(d){ if(colorProd.checked){return "none";}else{return d.data.style;} })
               .attr("d", d3.symbol().size(function(d) { return d.data.value? (nodeSizeFactor*parseFloat(d.data.value))+minSizeNode : 0} )
                                     .type(function(d) { if(d.data.name=="ighv"){return d3.symbolTriangle;
                                                         }else{return d3.symbolCircle;}
                                                       }));


      //add text to the node
      nodeEnter.append("text")
               .attr('font-size', 12) //set the size of the text
               .attr("dy", function(d) { return 20+(d.data.value*0.1);})	//set the emplacement of the text
               .attr("dx", 15)
               .attr("text-anchor", "middle")
               .text(function(d) { if(d.data.name!="ighv" && d.parent.data.name=="ighv"){ return d.data.name; }})
               .clone(true).lower();

      //update node
      var nodeUpdate = nodeEnter.merge(node);

      //transition to the proper position for the node
      nodeUpdate.transition().duration(duration)
                .attr("transform", function(d) { return "translate(" + radialPoint(d.x, d.y) + ")"; });

      nodeUpdate.select('path.nodeTree')
                .attr("d", d3.symbol().size(function(d) { return d.data.value? (nodeSizeFactor*parseFloat(d.data.value))+minSizeNode : 0})
                                      .type(function(d) { if(d.data.name=="ighv"){return d3.symbolTriangle;
                                                          }else{return d3.symbolCircle;}}))
                .attr('cursor', 'pointer');

      //remove any exiting nodes
      var nodeExit = node.exit().transition()
                  .duration(duration)
                  .attr("transform", function(d) { return "translate(" + radialPoint(source.x, source.y) + ")"; })
                  .remove();

      //reduce the node circles size to 0
      nodeExit.select('path.nodeTree').attr("d", d3.symbol().size(0));

      // ********* Creation of links *********

      //add the links between the nodes
      var link = svg2.selectAll("path.linkTree").data(links, function(d) { return d.id; });
  
      var linkEnter = link.enter().insert('path',"g")	//SVG path allow to draw shape
                   .attr("class", "linkTree")
                   .style("stroke", "#555")
                   .attr("d", function(d){ var s = {x : source.x0, y : source.y0}; return branchShape(s, s);});

      //update link
      var linkUpdate = linkEnter.merge(link);

      //transition back to the parent element position
      linkUpdate.transition()
                .duration(duration)
                .attr("d", function(d){ return branchShape(d, d.parent); });

      //remove any exiting links
      var linkExit = link.exit().transition()
                  .duration(duration)
                  .attr("d", function(d){ var s = {x : source.x, y : source.y}; return branchShape(s, s);})
                  .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d){ d.x0 = d.x; d.y0 = d.y;});

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
   
  });

}
