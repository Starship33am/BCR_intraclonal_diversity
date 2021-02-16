// **************************************** Bar chart representing abundance of clones **********************************************

function barChart(data){
  // set the dimensions and margins of the diagram
  var margin = {top: 20, right: 10, bottom: 50, left: 70},
      width = ((document.getElementById('barChart').offsetWidth)/1.5) - (margin.left + margin.right),	//get width of barChart element in px 
      height = (document.getElementById('barChart').offsetHeight/1.25) - (margin.top + margin.bottom);

  //set the ranges depending on the width and height
  const x = d3.scaleBand()
         .range([0, width])
         .padding(0.1);

  const y = d3.scaleLinear()
         .range([height, 0]);

  //create svg object
  var svg2 = d3.select("#barChart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //set the axis range depending on the value
  yMax = (d3.max(data, function(d) { return parseFloat(d["value"]); }));
  x.domain(data.map(function(d) { return d["name"]; }));
  y.domain([0, yMax]);

  //add the x axis to the svg
  svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")	
      .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    
  //add the y axis to the svg
  svg2.append("g").call(d3.axisLeft(y).ticks(6));

  //add the bar corresponding to the abundance of the clones. The width of the bar is determined by the function x and the height by the y function
  svg2.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .style("fill", function(d){ return d.color; })
      .attr("x", d => x(d["name"]))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d["value"]))
      .attr("height", d => height - y(d["value"]));

  //text label for the y axis
  svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font", "0.8em 'Trebuchet MS'")
      .text("Abundance (%)");   

  //the user doesn't enter a threshold value
  if(threshold==-1){threshold=yMax;}

  // Draw the line for the threshold
  svg2.append("line")
      .attr("class","thresholdLine")
      .attr("x1", 0)
      .attr("y1", y(threshold))
      .attr("x2", width)
      .attr("y2", y(threshold));
}
