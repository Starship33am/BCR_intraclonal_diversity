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
    file = user +"_"+clone+"_clonotype.json";
    path = "pipeline/usersFiles/"+user+"/tree/"+file;

//loading the json file
d3.json(path, function(error, dataTree) {
  if (error) throw error;

  //display only the 30 first clonotypes
  var file = [dataTree], clonotypesNames=[];
  firstClonotypes(file, 0, clonotypesNames);

  displayTree(dataTree);
  displaySequence(clonotypesNames);

});
