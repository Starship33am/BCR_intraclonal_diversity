//browse the tree of clonotypes to find the 5 first clonotypes with the most abundance
function findMostAbundantClonotypes(node, table){
  var longestTreeBranch = [0,{"sum":0,"nodeAbundance":0},{"sum":0,"nodeAbundance":[]}], lengthBranch = [], nodeSize = [], maxNodeSize = [], nodeAbundance = [[],[]];
  //for each children of the given node 
  for(var i in node.children){
    //the node is not silent
    if(node.children[i].data["name"][0]=="C"){
      node.children[i].data.value *= 100;
      //there is already 5 clonotypes stores in the tab
      if(table.length == 5){
        //Compare the abundance of the clonotypes to those in of the clonotypes in the tab
        comparisonOfAbundance(table, node.children[i]);
      }else{
        //add the clonotypes to the table
        table.push(node.children[i]);
        //sort the elment of the table depending on the abundance
        table.sort(function sortByAbondance(a, b){
          if (parseFloat(a.data.value) < parseFloat(b.data.value)){
            return -1;
          }else if (parseFloat(a.data.value) > parseFloat(b.data.value)){
            return 1;
          }
          return 0;
        });
        table.reverse();
      }
    }

    //look among the children of this node if there are clonotypes with more abundance
    if(node.children[i].children){ 
      longestTreeBranch = findMostAbundantClonotypes(node.children[i], table);
      //add to a table all the length of the branch
      lengthBranch.push(longestTreeBranch[0]+parseFloat(node.children[i].data.length));
      nodeSize.push(longestTreeBranch[1]["sum"]+(parseFloat(node.children[i].data.value)/100));
      maxNodeSize.push(longestTreeBranch[2]["sum"]+parseFloat(node.children[i].data.value));
      var abundanceList = [];
      for(var h in longestTreeBranch[1]["nodeAbundance"]){ abundanceList.push(longestTreeBranch[1]["nodeAbundance"][h]); }
      abundanceList.push(parseFloat(node.children[i].data.value));
      nodeAbundance[0].push(abundanceList);
      abundanceList = [];
      for(var h in longestTreeBranch[2]["nodeAbundance"]){ abundanceList.push(longestTreeBranch[2]["nodeAbundance"][h]); }
      abundanceList.push(parseFloat(node.children[i].data.value));
      nodeAbundance[1].push(abundanceList);
    }else{    
      //add to a table all the length of the branch
      lengthBranch.push(parseFloat(node.children[i].data.length));
      nodeSize.push(parseFloat(node.children[i].data.value)/100);
      //nodeNumber.push(1);
      maxNodeSize.push(parseFloat(node.children[i].data.value));
      nodeAbundance[0].push([parseFloat(node.children[i].data.value)]);
      nodeAbundance[1].push([parseFloat(node.children[i].data.value)]);
    }
  }

  for(var j in lengthBranch){
    if(lengthBranch[j]+nodeSize[j]>longestTreeBranch[0]+longestTreeBranch[1]["sum"]){
      longestTreeBranch[0]=lengthBranch[j];
      longestTreeBranch[1]["sum"]=nodeSize[j];
      //add the abundance of the node to the list to save the value of the node belonging to the longest branch
      longestTreeBranch[1]["nodeAbundance"] = nodeAbundance[0][j];
    }

    //find the branch with the highest abundance
    if(maxNodeSize[j]>longestTreeBranch[2]["sum"]){
      longestTreeBranch[2]["sum"]=maxNodeSize[j];
      //add the abundance of the node to a list to save the value of the node belonging to the branch with the highest abundance
        longestTreeBranch[2]["nodeAbundance"] = nodeAbundance[1][j];
    }
  }
  return longestTreeBranch;
}

//modify the table that store the most abundant clonotypes if clonotypewith a abundance superior is found
function comparisonOfAbundance(table, clonotype){
  var nbElement = table.length; 
  var superior = true;
  var indice = -1;
  //browse all the element of the table to find if the clonotype has an abondance superior to the other
  while( superior && (nbElement != 0)){
    if(parseFloat(clonotype.data.value)>parseFloat(table[nbElement-1].data.value)){
      indice = nbElement-1; //store the position of the element 
    }else{
      superior=false;
    }
    nbElement--;
  }
  //modify the table if the clonotype have a abundance superior to the clonotype of the table
  if(indice!=-1){
    table.splice(indice, 0, clonotype); //add the clonotype to the table
    table.pop(); //delete the last element of the table
  }
}

//return the object with the highest factor to calculate the node size
function determineNodeSize(sizeWidth, sizeHeight, maxAbundance){ 
  var factorWidth = (sizeWidth["max"]-sizeWidth["min"])/maxAbundance,
      factorHeight = (sizeHeight["max"]-sizeHeight["min"])/maxAbundance;
  if(Math.max(factorWidth, factorHeight)==factorWidth){
    return sizeWidth;
  }else{
    return sizeHeight;
  } 
}

//create object containing the somme of node size
function counter() { this.sumNodeSize = 0; }

//determine the longest branch of the tree
function determineLongestBranch(data,nodeSize,height,type){
  counter.prototype.add = function (node, a, b) { node.forEach(function(abundance){this.sumNodeSize += Math.sqrt(abundance*a+b);},this); };
  var maxAbundance = Math.max.apply(null,data[2]["nodeAbundance"]);

  if(type=="differentSize"){
    var nodeSizeFactor = (nodeSize["max"]-nodeSize["min"])/maxAbundance;
  }else{
    var nodeSizeFactor = 0;
  }

  //determine the longest branch of the tree depending by adding all the node size
  var abundanceLongestBranch = new counter();
  abundanceLongestBranch.add(data[1]["nodeAbundance"],nodeSizeFactor,nodeSize["min"]);
  var highestAbundance = new counter();
  highestAbundance.add(data[2]["nodeAbundance"],nodeSizeFactor,nodeSize["min"]);
  //check that the sum of the size nodes doesn't exceed the height of the svg 
  if(abundanceLongestBranch.sumNodeSize>=highestAbundance.sumNodeSize && (height-abundanceLongestBranch.sumNodeSize)>(height/5)){
    return abundanceLongestBranch.sumNodeSize;
  }else if(highestAbundance.sumNodeSize>abundanceLongestBranch.sumNodeSize && (height-highestAbundance.sumNodeSize)>(height/5)){
    return highestAbundance.sumNodeSize;
  }else{
    //resize the node max and min value 
    var difference = Math.max(abundanceLongestBranch.sumNodeSize,highestAbundance.sumNodeSize) - height;
    var diffPercentage = ((difference*100)/height)/100+0.35;
    if(type=="differentSize"){
      nodeSize["max"] *= (1-diffPercentage);
      nodeSize["min"] *= diffPercentage;
      nodeSizeFactor = (nodeSize["max"]-nodeSize["min"])/maxAbundance;
    }else{
      nodeSize["min"] /= (diffPercentage*10);
      nodeSizeFactor = 0;
    }
    abundanceLongestBranch = new counter();
    abundanceLongestBranch.add(data[1]["nodeAbundance"],nodeSizeFactor,nodeSize["min"]);
    highestAbundance = new counter();
    highestAbundance.add(data[2]["nodeAbundance"],nodeSizeFactor,nodeSize["min"]);
    return Math.max(abundanceLongestBranch.sumNodeSize,highestAbundance.sumNodeSize);
  }
}


/* ***************************************** functions used to visualize the tree ************************************************* */

//function to apply the modification to the tree
function changeTree(){
  displayTree(dataClonotypes);
}

//place the coordonate of the node depending on the size of the node and the length of the branch
function determineNodeCoord(data, spaceBetweenNodes, nodeSizeFactor, yUnit, minSizeNode){
  var nbrLeaves=0;
  data.data["nodeSize"] = (parseFloat(data.data.value)*nodeSizeFactor)+minSizeNode; //store the size of the node
  data.y = 0;
  nbrLeaves = determineXYCoord(data, nbrLeaves, spaceBetweenNodes, nodeSizeFactor, yUnit, minSizeNode);
}

//add the x and y coordinate to the node of the tree
function determineXYCoord(data, nbrLeaves, spaceBetweenNodes, nodeSizeFactor, yUnit, minSizeNode){
  var xCoordSomme = 0, cptChildren = 0; 
  for(var i in data.children){
    cptChildren += 1;
    data.children[i].data["nodeSize"] = (parseFloat(data.children[i].data.value)*nodeSizeFactor)+minSizeNode; //store the size of the node
    data.children[i].y = data.y + (Math.sqrt(data.data["nodeSize"]/3)) + yUnit*parseInt(data.children[i].data.length) +(Math.sqrt(data.children[i].data["nodeSize"]/3)) ;
    if(data.children[i].children){ 
      nbrLeaves = determineXYCoord(data.children[i],nbrLeaves,spaceBetweenNodes,nodeSizeFactor, yUnit, minSizeNode); 
      xCoordSomme += data.children[i].x;  
    }else{
      nbrLeaves+=1;
      if(nbrLeaves>1){ 
        data.children[i].x = (spaceBetweenNodes/2)+(nbrLeaves-1)*spaceBetweenNodes; 
        xCoordSomme += (spaceBetweenNodes/2)+(nbrLeaves-1)*spaceBetweenNodes;
      }else{
        data.children[i].x = spaceBetweenNodes/2; 
        xCoordSomme += spaceBetweenNodes/2;
      }
    }
  }
  data.x = xCoordSomme/cptChildren;

  return nbrLeaves;
}

//give the start and end point to a branch    
function branchShape(s,t) {
  return "M" + s.x + "," + (s.y-(Math.sqrt(s.data.nodeSize/3))) + "V" + (t.y+(Math.sqrt(t.data.nodeSize/3))) + "H" + t.x;
}

//display tooltips on mouseover nodes of the tree
function displayOnTree(index,clonotypesTable){
  for(var i in clonotypesTable){
    if(index==parseInt(clonotypesTable[i]["index"])){
      clonotypesDistances.push(clonotypesTable[i]["name"]);
    }else if(index<parseInt(clonotypesTable[i]["index"])){
      break;
    }
  }
  displayTree(dataClonotypes);
}

//hide tooltips of the nodes tree   
function hideOnTree(){ clonotypesDistances.length=0;displayTree(dataClonotypes);}
 
function collapse(d, depth){
  if(d.children){
    if(d.depth>=dpth){
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }else{
      d.children.forEach(collapse);
    }
  }
}
