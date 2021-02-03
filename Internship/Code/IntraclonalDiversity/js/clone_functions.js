/* *************************************** Show the elements present on the main page ********************************************* */

function mainPage(dataClone, state){
  //remove content of barChart when we are zooming out
  document.getElementById("nextButton").style.display = "none";
  //display the bar chart
  var chart = document.getElementById('barChart')
  chart.style.display = "flex";
  //deactivate tree container
  document.getElementById("clonotypeTree").style.display = "none";
  //deactivate checkbox
  document.getElementById("checkboxProductivity").style.display = "none";
  //display the form which allows to enter a threshold value
  var form = document.getElementById('thresholdSelection');
  form.style.display = "block";
  //deactivate the clonotype table
  var clonotypeTable = document.getElementById('cloneTable');
  clonotypeTable.innerHTML = "";
  //table that contain the data of clones
  tableData(dataClone, ["Clone", "Abundance(%)", "Number of reads", "V region", "J region", "cdr3", "Productivity"], ["name","value","reads", "idV","idJ","cdr3", "productivity"]);
  //create the different element if the user load the page for the first time
  if(state){
    //create bar chart representation
    barChart(dataClone.slice(0,9));
  }
}


/* ************************************* Load the page showing the description of a clone ***************************************** */

function clonePage(dataClonotypes, clone){
  //remove the elements of the main page
  //deactivate the bar chart elements
  var threshold = document.getElementById('thresholdSelection');
  threshold.style.display = "none";
  var chart = document.getElementById('barChart');
  chart.style.display = "none";
  //deactivate the clone table
  var cloneTable = document.getElementById('cloneTable');
  cloneTable.innerHTML = "";
  //table of clonotypes data
  tableData(dataClonotypes, ["Clonotype", "Abundance in repertoire (%)", "Abundance in clone (%)", "cdr3", "Productivity", "Sequence"], ["name", "value_rep", "value", "cdr3", "productivity", "seq"]);
  //activate button to access to the description of clones
  document.getElementById("nextButton").style.display = "block";
  //activate the checkbox to visualise the productivity
  document.getElementById("checkboxProductivity").style.display = "block";
  //launch the tool to obtained hierarchy of clonotypes
  //activate tree container
  document.getElementById("clonotypeTree").style.display = "block";
  d3.select("#clonotypeTree svg").remove()
  displayTree();
}


/* ****************************************** functions used to visualize the tree ************************************************ */

function radialPoint(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

//give the start and end point to a branch    
function branchShape(s,t) {
  return "M" + radialPoint(s.x, s.y)[0] + "," + radialPoint(s.x, s.y)[1] + " " + radialPoint(t.x, t.y)[0] + "," + radialPoint(t.x, t.y)[1]; //M means move to
}

//browse the tree of clonotypes to find the 5 first clonotypes with the most abundance
function findMostAbundantClonotypes(data){
  var longestTreeBranch = [0,0,0,0], lengthBranch = [], nodeSize = [], maxAbundance = [];
  //for each children of the given node 
  for(var i in data.children){
    //look among the children of this node if there are clonotypes with more abundance
    if(data.children[i].children){ 
      longestTreeBranch = findMostAbundantClonotypes(data.children[i]);
      //add to a table all the length of the branch
      lengthBranch.push(longestTreeBranch[1]+parseFloat(data.children[i].data.length));
      nodeSize.push(longestTreeBranch[2]+(parseFloat(data.children[i].data.value)/100));
    }else{    
      //add to a table all the length of the branch
      lengthBranch.push(parseFloat(data.children[i].data.length));
      nodeSize.push(parseFloat(data.children[i].data.value)/100);
    }
    maxAbundance.push(parseFloat(data.children[i].data.value));
  }

  longestTreeBranch[0] += 1;
  for(var j in lengthBranch){
    if(lengthBranch[j]+nodeSize[j]>longestTreeBranch[1]+longestTreeBranch[2]){
      longestTreeBranch[1]=lengthBranch[j];
      longestTreeBranch[2]=nodeSize[j];
    }
  }

  if(Math.max.apply(null,maxAbundance)>longestTreeBranch[3]){ longestTreeBranch[3]=Math.max.apply(null,maxAbundance); }

  return longestTreeBranch;
}


/* **************************************** functions used to change the bar chart ************************************************ */

function changeThreshold(){ 
  threshold = parseFloat(document.thresholdForm.threshold.value);
  if(threshold){
    var height = (document.getElementById('barChart').offsetHeight/1.25) - 70;
    const y = d3.scaleLinear()
             .range([height, 0]);
    y.domain([0, yMax])

    var svg2 = d3.select("#barChart svg");
    svg2.selectAll(".thresholdLine")
             .attr("y1", y(threshold))
             .attr("y2", y(threshold));
  }else{
    alert("Please enter a percentage");
  }
}
