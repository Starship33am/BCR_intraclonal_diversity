var treeData = {
	  "name" : "G",
	  "parent": "null",
	  "children" : [
		{ "name" : "g1",
	  	  "parent": "G",
	  	  "children" : [
			{ "name" : "g2",
	  	  	  "parent" : "g1",
	  	  	  "children" : [
				{ "name" : "g3",
	  	  	  	  "parent" : "g2",
	  	  	 	  "children" : [
					{ "name" : "g4",
	  	  	  		  "parent" : "g3",
	  	  	  		  "children" : [
						{ "name" : "1170",
	  	  	  		  	  "parent" : "g4",
	  	  	  		  	  "children" : [
							{ "name" : "g5",
	  	  	  		  		  "parent" : "1170",
	  	  	  		  		  "children" : [
								{ "name" : "150",
	  	  	  		  			  "parent" : "g5"
	  	  	  		  			},
								{ "name" : "380",
	  	  	  	  				  "parent": "g5"
	  	  	  	  				}
						  	  ]
							},
							{ "name" : "70",
  	  	  		  			  "parent" : "1170"
							}
						  ]
						},
						{ "name" : "30",
	  	  	  	  		  "parent" : "g4"
						}
					  ]
					},
					{ "name" : "50",
	  	  	  	  	  "parent" : "g3"
					}
				  ]
				},
				{ "name" : "40",
	  	  	    	  "parent" : "g2"
				}
			  ]
			},
			{ "name" : "67",
	    	  	  "parent" : "g1"
			}
		  ]
		},
		{ "name" : "30",
  	  	  "parent": "G"
		}
	  ]
	};

//  assigns the data to a hierarchy using parent-child relationships
var nodes = d3.hierarchy(treeData); //data structure that represente a hieratchy

// set the dimensions and margins of the diagram
var margin = {top: 40, right: 90, bottom: 50, left: 90},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// declares a tree layout and assigns the size
var treemap = d3.tree()	//creating the tree layout 
    .size([width, height]);

// maps the node data to the tree layout
nodes = treemap(nodes);


// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// adds the links between the nodes
var link = g.selectAll(".link")
    .data( nodes.descendants().slice(1))
  .enter().append("path")
    .attr("class", "link")
    .attr("d", function(d) {
       return "M" + d.x + "," + d.y
         + "C" + d.x + "," + (d.y + d.parent.y) / 2
         + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
         + " " + d.parent.x + "," + d.parent.y;
       });

//the attribute d defined the shape of an SVG Path element


// adds each node as a group
var node = g.selectAll(".node")
    .data(nodes.descendants())
  .enter().append("g")
    .attr("class", function(d) { 
      return "node" + 
        (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; });

// adds the circle to the node
node.append("circle")
  .attr("r", 10);

// adds the text to the node
node.append("text")
  .attr("dy", ".35em")
  .attr("y", function(d) { return d.children ? -20 : 20; })
  .style("text-anchor", "middle")
  .text(function(d) { return d.data.name; });

