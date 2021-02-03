/* This script allows the visualization of the repertoire from data supplied by the user. There is thus a number of visualizations in order to represent this repertoire : 
	- zooming circle packing to observe the abundance of clones and clonotypes
	- bar chart to observe the clonality threshold
	- an area allowing to select the clones of interest for further analysis
	- an area where the sequences V, J and cdr3 regions can be observed */

// ************************************************************************************

//title of the page :
//titleAnalysis.innerText = "<?php echo $analyseName; ?>";
//recover the cookies from php and put them in an object
var cookies = document.cookie.split("; ").map(function(element){ return element.split("="); }).reduce(function(prev,cur){ prev[cur[0]] = cur[1]; return prev }, {});

var yMax = 0;
var threshold = -1;
var firstCreation = true;
var objectSelected;

// *********************************** Zooming circle packing visualization of the repertoire ***************************************

//selection of svg
var svg1 = d3.select("#chart1").append("svg")
        .attr("width", "100%")
        .attr("height", "100%"),
    diameter = Math.min(document.getElementById('chart1').offsetWidth, document.getElementById('chart1').offsetHeight),
    g = svg1.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")"); /* set the size of the */

//creation of pack layout
var packLayout = d3.pack()
              .size([(diameter), (diameter)])
              .padding(6);//padding around each circle

//declare a new local variable scoped by the DOM
var local = d3.local();

var user = cookies["Userfile"],
    file = user +"_repertoire_two_levels_info.json";
    path = "pipeline/usersFiles/"+user+"/GTM/"+file;

//loading the json file
d3.json(path, function(error, data) {
  if (error) throw error;

  //separate the data in two: the parents containing the clones and the children containing the clonotypes. This then makes it possible in the representation to keep the proportions between the clones regardless of the number of clonotypes they contain.
  var children = [],
  parent = parseClone(data, children);
  objectSelected = children; //store the clone or clonotype depending on the zoom we have done to allow to download the data

  //parent pack to represente the clone
  root = d3.hierarchy(parent)
      .sum(function(d) { return d.value; });

  //store the root in focus variable to allow zoom
  var focus = root, view, cloneZoom = false, child;

  //create the parent circle pack from the parent pack, add a g container for each clone
  var parentNodes = g.selectAll("g")
                 .data(packLayout(root).descendants())
                 .enter().append("g")
      
  //create circle on each g container of the clones and add style to this circle	
  parentNodes.append("circle")
             .attr("r", function(d) { return d.r; })
             .style("opacity", 0.7)
             .style("stroke-width", 2)
             .style("fill", function(d){ return d.data.color; })
             .style("stroke", function(d){ return d.data.stroke; })
             .style("stroke-dasharray", function(d){ return d.data.style; })
             .on("click", function(d,i) { if(d3.select(child)._groups[0][0]){d3.select(child)._groups[0][0].remove();} 
                                          if (focus !== d && children[i-1].children) {
                                            child = displayClonotype(d,i);
                                            cloneZoom=true;
                                            zoom(d), d3.event.stopPropagation();
                                            objectSelected = children[i-1].children;
                                            clonePage(children[i-1].children,d.data.name);} });

  //add name of the clone on the circle
  parentNodes.append("text")
             .attr("class", "label")
             .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
             .style("fill", "black")
             .style("font-size", "12px")
             .style("text-anchor", "middle")
             .text(function(d) { if(d.data.value>=1){return d.data.name; } });

  //allow to zoom out
  svg1.on("click", function() { d3.select(child)._groups[0][0].remove(); cloneZoom= false; zoom(root);  objectSelected = children; mainPage(children, firstCreation); } );

  //calculate the cordinates of the circles representing the clones
  nodeProperties([root.x, root.y, root.r * 2], root);

  //display de bar chart graph, the sequences, the selection area and the abundance table
  mainPage(children, firstCreation);
  firstCreation = false;
   
  //separate clones from clonotypes
  function parseClone(data, clonotypes){
    clones = {"value": data["value"], "color": data["color"], "stroke": data["stroke"], "style": data["style"],"children" : []}
    //browse the data and store all the clones the variable "clones" and in the variable "clonotypes"
    for(var i in data.children){
      clones["children"].push({"name": data.children[i]["name"], "length": data.children[i]["length"], "value": data.children[i]["value"], "color": data.children[i]["color"], "stroke": data.children[i]["stroke"], "style": data.children[i]["style"], "idV": data.children[i]["idV"], "idJ": data.children[i]["idJ"], "cdr3": data.children[i]["cdr3"], "productivity": data.children[i]["productivity"]});
      clonotypes.push({"name": data.children[i]["name"], "length": data.children[i]["length"], "value": data.children[i]["value"], "color": data.children[i]["color"], "stroke": data.children[i]["stroke"], "style": data.children[i]["style"], "idV": data.children[i]["idV"], "idJ": data.children[i]["idJ"], "cdr3": data.children[i]["cdr3"], "productivity": data.children[i]["productivity"]});
      //store the clonotypes of the clone in the variable "clonotypes" if there are any
      if(data.children[i].children){
        clonotypes[i].children = data.children[i].children;
      }
    }
    return clones;
  }

  //set the size of the nodes
  function nodeProperties(v,child) {
    var k = (diameter / (v[2])); view = v;
    //modify the cordinate of the cercle representing the clones depending on the view
    parentNodes.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k  + "," + (d.y - v[1]) * k + ")"; });
    parentNodes.selectAll("circle").attr("r", function(d) { return d.r * k; });
    //modify the cordinates of the circle representing the clonotypes if we are zooming in
    if(cloneZoom){
      child.attr("transform", function(d) { return "translate(" + (d.x-(v[2]/2))*k + "," + (d.y-(v[2]/2)) *k + ")"; });
      child.selectAll("circle").attr("r", function(d) { return d.r * k; });
      parentNodes.selectAll("text").style("display","none")
      child.selectAll("text").style("display","inline")
    }else{
    //remove the circle representing the clonotypes of the clones because we are zooming out
      svg1.selectAll(".childNodes").remove();
      parentNodes.selectAll("text").style("display","inline");
    }
  }

  //allow to zoom in or out of the clone in the zooming circle packing reprsentation
  function zoom(d){
    //change the focus variable into the object we are on
    var focus0 = focus; focus = d;
    var transition = d3.transition()
                  .duration(750)	//specify the duration of the transition in miliseconde
                  .tween('zoom', function(d) {			//run custom code during the transition
                                               var transitionFunction = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);	//apply betwen two views (starts and end)
                                               return function(t) { nodeProperties(transitionFunction(t),child); };
                  });
  }

  function displayClonotype(d,i){
    var focusIndex = i;	//index of the clone we are zooming on
    //store the radius of all the clones
    var parentRadius = packLayout(root).descendants().filter(function(d) { return d.depth == 1; }).map(function(d) { return d.r; });
    //creation of child pack layout
    var childPack = d3.pack().size([parentRadius[i-1]*2 , parentRadius[i-1]*2 ]).padding(6);
    //child pack to represente the clonotypes

    var childRoot =  d3.hierarchy(children[i-1])
	         .sum(function(d) { return d.value_rep; });
    childRoots = childPack(childRoot).descendants(); 
    //create the child circle pack, add a g container for each clonotype
    var childNodes = parentNodes.filter( function(d,i){ local.set(this, d); return i == focusIndex}) //keep g in the local variable and filter to retrieve the concerned node
                                .selectAll("g")
                                .attr("class","childNodes")
                                .data(childRoots)
                                .enter()
                                .append("g")
                                .attr("transform", function(d) { var offset = local.get(this).r; return "translate(" + (d.x-offset)  + "," + (d.y-offset)  + ")"; })

    //create circle on each g container of the clonotypes and add style to this circle
    childNodes.filter(function(d) { return d.depth > 0 })  //skip parent, it's already drawn
              .append("circle")
              .attr("r", function(d) { return d.r ; })
              .style("opacity", 0.7)
              .style("stroke-width", 2)
              .style("fill", function(d){ return d.data.color; })
              .style("stroke", function(d){ return d.data.stroke; })
              .style("stroke-dasharray", function(d){ return d.data.style; })

    //add name of the clone on the circle
    childNodes.append("text")
              .attr("class", "label")
              .filter(function(d,i) { return i >0; } )	//do not count the root
              .style("fill", "black")
              .style("font-size", "12px")
              .style("text-anchor", "middle")
              .text(function(d) { if(d.data.value>=1){ return d.data.name }});

    return childNodes
  }

});
