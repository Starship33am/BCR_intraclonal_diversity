/* ********************************************************* DISTANCE ************************************************************ */ 

//create the representation of the distances
function distancesRepresentation(distanceOfClonotypes){

  var distanceTable = [] //store the clonotypes for which the distance will be represented on the chart
  //retrieve the name of all the clonotypes selected
  var clonotypesName = distanceOfClonotypes.map(function(d){ return d.data.name });
  createDistanceTable(distanceTable, distanceOfClonotypes); //table of the distance of the 5 most abundant clonotypes that'll be use in the graph representing the distance

  //margin = {top: 50, right: 10, bottom: 50, left: 100};
  width = (document.getElementById('chart2').offsetWidth );	//get width of chart2 element in px 
  height = (document.getElementById('chart2').offsetHeight );
  chartRadius = (Math.min(width, height) / 2) - 50;

  var svg = d3.select('#chart2').append('svg')
         .attr('width', width)
         .attr('height', height)
         .append('g')
           .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  var tooltip = d3.select('#chart2').append('div')
             .attr('class', 'tooltip');

  var pi = Math.PI,
      arcPosition = 50,	//position of the arc relative to the center
      arcPadding = 10;	//space between the different arcs

  var maxDistance = d3.max(distanceTable, function(d){ return d.length });

  //create a quantitative linear scale. This function map data values into visual variables
  var scale = d3.scaleLinear()
           .domain([0, maxDistance * 1.33])	//minimum and maximum values of the input data (the min and max distance between clonotype)
           .range([0, 2 * pi]); //range of values to which the distance values match

  //array of values sampled from the scale’s domain
  var ticks = axisStepCalcul(maxDistance);

  //number of clonotypes
  var numClonotypes = 8; //(if we want to have the number of clonotype : clonotypesName.length)

  //calculation of the width of the arcs according to the number of clonotypes
  var arcWidth = (chartRadius - arcPosition - numClonotypes * arcPadding) / numClonotypes;

  //create a new arc generator
  var arc = d3.arc()
         .innerRadius(function(d, i){ return getInnerRadius(parseInt(distanceTable[i].index)); }) //set the inner radius to a specific value determine by a function
         .outerRadius(function(d, i){ return getOuterRadius(parseInt(distanceTable[i].index)); })
         .startAngle(function(d, i){ return scale(parseInt(distanceTable[i].start)); })	//determine the start angle for the arcs
         .endAngle(function(d){ return scale(d); });	//end angle of the cercle determine by the scale function

  //create radial axis to add text to identify the different axes
  var radialAxis = svg.append('g')
                .selectAll('g')
                .data(distanceTable)
                .enter().append('g');

  radialAxis.append('text')
            .style('font', '12px sans-serif')
            .attr('x', -45)
            .attr('y', function(d, i){ return (-getOuterRadius(i) + arcPadding); })
            .text(function(d,i){ return clonotypesName[i]; })
            .on("mousemove", function(d,i){displayOnTree(i,distanceTable);})
            .on("mouseout",hideOnTree);

  //create axial axis to identify the distances
  var axialAxis = svg.append('g')
               .selectAll('g')
               .data(ticks)
               .enter().append('g')
               .attr('transform', function(d) { return 'rotate(' + ((scale(d) * 180 / pi) - 90) + ')'; });

  //add line to the axial axis
  axialAxis.append('line')
           .style("stroke", "#cccccc")
           .style("stroke-width", "1px")
           .attr('x2', chartRadius);

  axialAxis.append('text')
           .attr('x', chartRadius + 10)
           .style('font', '12px sans-serif')
           .style('text-anchor', function (d) { return (scale(d) >= pi && scale(d) < 2 * pi ? 'end' : null); })
           .attr('transform', function (d) { return 'rotate(' + (90 - (scale(d) * 180 / pi)) + ',' + (chartRadius + 10) + ',0)'; })
           .text(function(d){ return d; });

  //data arcs
  var arcs = svg.append('g')
          .selectAll('path')
          .data(distanceTable)
          .enter().append('path')
          .style('fill', function(d, i) { return d.color; } )
          .style("stroke", function(d){ return d.stroke; })
          .style("stroke-dasharray", function(d){ return d.style; })
          .style("stroke-width", 0.75)

  arcs.transition()
      .duration(1)
      .attrTween('d', arcTween);

  arcs.on('mousemove', showTooltip)
  arcs.on('mouseout', hideTooltip)

  function arcTween(d, i) {
    var interpolate = d3.interpolate(0, d.length);
    return t => arc(interpolate(t), i);
  }

  function showTooltip(d) {
    tooltip.style("left", ((d3.event.pageX + 10)+"px"))
      .style("top", ((d3.event.pageY + 15)+"px"))
      .style('display', 'inline-block')
      .html(d.length-d.start);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 0.8);
    clonotypesDistances.push(d["name"]);
    displayTree(dataClonotypes);
  }

  function hideTooltip() {
    tooltip.style('display', 'none');
    d3.select(this)
      .style("stroke", function(d){ return d.stroke; })
      .style("opacity", 1);
    hideOnTree();
  }

  //calculate the value of inner radius in function of the index of the clonotype
  function getInnerRadius(index) {
    return arcPosition + (numClonotypes - (index + 1)) * (arcWidth + arcPadding); //the position of the inner radius corresponds to the addition of distance from the center and the thickness of the other arcs according to the clonotype index
  }

  //calculate the value of outer radius in function of the index of the clonotype
  function getOuterRadius(index) {
    return getInnerRadius(index) + arcWidth; //the position of the outer radius correpond to the addition of the position of the inner radius and the tickness of the arc
  }
}
