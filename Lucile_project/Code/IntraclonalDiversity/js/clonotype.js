/* This script allows the visualization of clonotype of a clone */

// ************************************************************************************


//title of the page :
//titleAnalysis.innerText = "<?php echo $title; ?>";
//recover the cookies from php and put them in an object
var cookies = document.cookie.split("; ").map(function(element){ return element.split("="); }).reduce(function(prev,cur){ prev[cur[0]] = cur[1]; return prev }, {});

var clone = localStorage['clone'];
//localStorage.removeItem( 'clonotypeData' ); // Clear the localStorage
var selectedNode = [], firstTime = true, dataClonotypes, clonotypesDistances=[], treeBranches=[];

var user = cookies["Userfile"],
    file = user +"_"+clone.split("C")[1]+"_30_tree.json";
    path = "pipeline/usersFiles/"+user+"/Output/"+file;

//loading the json file
d3.json(path, function(error, dataTree) {
  if (error) throw error;

  displayTree(dataTree);
  displaySequence();

});
