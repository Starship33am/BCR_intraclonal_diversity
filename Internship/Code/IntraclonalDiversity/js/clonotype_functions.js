//stores the first 30 clonotypes found while going down the tree
function firstClonotypes(file, cpt, names) {
  if(cpt<25 && file.length>0){
    var newfile = [], nbr_node = 0, size = 0;
    for(var i in file){
      for(var j in file[i].children){
        cpt ++;
        newfile.push(file[i].children[j]);
        names.push(file[i].children[j]["name"]);
      }
    }
    firstClonotypes(newfile, cpt, names);
  }else{
    for(var i in file){
      if(file[i].children){
        file[i]._children = file[i].children;
        file[i].children = null;
      }
    }  
  }
}

//browse the tree of clonotypes to find the 5 first clonotypes with the most abundance
function findMostAbundantClonotypes(node, table){
  var longestTreeBranch = [0,0,0], lengthBranch = [], nodeSize = [];
  //for each children of the given node 
  for(var i in node.children){
    //there is already 5 clonotypes stores in the tab
    if(table.length == 5){
      //Compare the abundance of the clonotypes to those in of the clonotypes in the tab
      comparisonOfAbundance(table, node.children[i]);
    }else{
      //add the clonotypes to the table
      table.push(node.children[i]);
      //sort the elment of the table depending on the abundance
      table.sort(function sortByAbondance(a, b){
        if (a.data.value < b.data.value){
          return -1;
        }else if (a.data.value > b.data.value){
          return 1;
        }
        return 0;
      });
      table.reverse();
    }

    //look among the children of this node if there are clonotypes with more abundance
    if(node.children[i].children){ 
      longestTreeBranch = findMostAbundantClonotypes(node.children[i], table);
      //add to a table all the length of the branch
      lengthBranch.push(longestTreeBranch[1]+parseFloat(node.children[i].data.length));
      nodeSize.push(longestTreeBranch[2]+(parseFloat(node.children[i].data.value)/100));
    }else{    
      //add to a table all the length of the branch
      lengthBranch.push(parseFloat(node.children[i].data.length));
      nodeSize.push(parseFloat(node.children[i].data.value)/100);
    }
  }

  longestTreeBranch[0] += 1;
  for(var j in lengthBranch){
    if(lengthBranch[j]+nodeSize[j]>longestTreeBranch[1]+longestTreeBranch[2]){
      longestTreeBranch[1]=lengthBranch[j];
      longestTreeBranch[2]=nodeSize[j];
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
    if(parseFloat(clonotype.data.value)>table[nbElement-1].data.value){
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


/* ***************************************** functions used to visualize the tree ************************************************* */

//function to apply the modification to the tree
function changeTree(){
  displayTree(dataClonotypes);
}

//place the coordonate of the node depending on the size of the node and the lenght of the branch
function determineNodeCoord(data, spaceBetweenNodes, nodeSizeFactor, yUnit, minSizeNode){
  var nbrLeaves=0;
  data.y = 0;
  nbrLeaves = determineXYCoord(data, nbrLeaves, spaceBetweenNodes, nodeSizeFactor, yUnit, minSizeNode);
}

//add the x and y coordinate to the node of the tree
function determineXYCoord(data, nbrLeaves, spaceBetweenNodes, nodeSizeFactor, yUnit, minSizeNode){
  var xCoordSomme = 0, cptChildren = 0; 
  for(var i in data.children){
    cptChildren += 1;
    data.children[i].y = data.y + yUnit*data.children[i].data.length + (Math.sqrt((parseFloat(data.children[i].data.value)*nodeSizeFactor)+minSizeNode)/2);
    if(data.children[i].children){ 
      nbrLeaves = determineXYCoord(data.children[i],nbrLeaves,spaceBetweenNodes,nodeSizeFactor, yUnit, minSizeNode); 
      xCoordSomme += data.children[i].x;  
    }else{
      nbrLeaves+=1;
      if(nbrLeaves>1){ 
        data.children[i].x = nbrLeaves*spaceBetweenNodes; 
        xCoordSomme +=nbrLeaves*spaceBetweenNodes;
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
  return "M" + s.x + "," + s.y + "V" + t.y + "H" + t.x;
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

/* ************************************* functions used to visualize the distances ************************************************ */

//create an array which contain the five clonotpes with the most abundance to allow to draw the chart
function createDistanceTable(table, clonotypes){
  //browse the table containing the clonotype to represent
  for(var i in clonotypes){
    parentsLength = storeClonotypesAncestor(table, clonotypes[i], i, clonotypes[i].data.name);
  }
}

//browse all the parent of clonotype to add them to the array it is necessary to represent the distance
function storeClonotypesAncestor(table, clonotype, index, name){
  //browse in the parent of the clonotype
  if(clonotype.parent){
    parentsLength = storeClonotypesAncestor(table, clonotype.parent, index, name);
    //allow to know which name should be write on the graph
    if(name==clonotype.data["name"]){ appear=true; }else{ appear=false; }
    //cumulate the length of the parent to allow to draw the distances on the graph
    length = parseFloat(clonotype.data["length"])+parentsLength
    table.push({"name":clonotype.data["name"], "value":clonotype.data["value"], "length":length, "color":clonotype.data["color"], "index":index, "start":parentsLength, "stroke":clonotype.data["stroke"], "style":clonotype.data["style"]}); //add the clonotype to the table of clonotype
    return length;
  }else{
    return 0;
  }  
}

function axisStepCalcul(distance){
  var step, axisStep = [];
  if(distance<0){
    step = 0.5;
  }else if(distance<=10){
    step = 1;
  }else{
    step = Math.round(distance/10);
  }
  for (var i = 0; i < distance; i += step) {
    axisStep.push(i);
  }
  axisStep.push(distance);
  return axisStep;
}


/* ***************************************** functions used to visualize the sequences ******************************************** */

function headerInformation(tr1, tr2, tr3, cpt, column, className, nbr, regionName){
  for(var i in column){

    var th1 = document.createElement('th');
    var th2 = document.createElement('th');
    var th3 = document.createElement('th');

    if(i<nbr[0] || i>nbr[1]){
      th1.appendChild(document.createTextNode(""));
    }else{
      th1.appendChild(document.createTextNode(regionName.shift()));
    }

    if(cpt%10==0){
      th2.appendChild(document.createTextNode(cpt));
    }else{
      th1.appendChild(document.createTextNode(""));
    }

    th3.classList = className;
    th3.appendChild(document.createTextNode(column[i]));

    tr1.appendChild(th1);
    tr2.appendChild(th2);
    tr3.appendChild(th3);

    cpt+=1;

  }

  return cpt;
}
  
function sequenceData(data){
  var tableau = [];
  var seq = data.split("\n");
  for(var i in seq){
    var element = seq[i].split("	");
    tableau.push({"name":element[0],"V_region":element[1],"cdr3_region":element[2],"J_region":element[3]})
  }
  return tableau;
}

function childClonotypeSequence(data,table,clonotypesNames){
  //browse the clones and show the sequences for each of them
  for(var i in data){ 
    if(clonotypesNames.indexOf(data[i]["name"])!=-1){

      //create a tr element to add a line and add it to the table
      var tr = document.createElement('tr');
      table.appendChild(tr);
      //create a th element to add a cell that contain the name
      var td1 = document.createElement('td');
      td1.appendChild(document.createTextNode(data[i]["name"]));
      tr.appendChild(td1);

      for(var j in data[i]["V_region"]){
        //create a td element to add a cell that contain the sequence
        var td2 = document.createElement('td');
        td2.classList = "Vregion";
        td2.appendChild(document.createTextNode(data[i]["V_region"][j]));
        tr.appendChild(td2);
      }

      for(var j in data[i]["cdr3_region"]){
        //create a td element to add a cell that contain the sequence
        var td3 = document.createElement('td');
        td3.classList = "cdr3region";
        td3.appendChild(document.createTextNode(data[i]["cdr3_region"][j]));
        tr.appendChild(td3);
      }

      for(var j in data[i]["J_region"]){
        //create a td element to add a cell that contain the sequence
        var td4 = document.createElement('td');
        td4.classList = "Jregion";
        td4.appendChild(document.createTextNode(data[i]["J_region"][j]));
        tr.appendChild(td4);
      }

    }
  }

}


/* ******************************************** download clonotype informations *************************************************** */

function downloadClonotypesInformations(){
  var germlineSequence = document.getElementById('tableSequence').getElementsByTagName('thead')[0].getElementsByTagName('tr')[2];
  var sequencesTable = document.getElementById('tableSequence').getElementsByTagName('tbody')[0];
  var sequences = "Name;V region;cdr3 region;J region\n";
  var prevClassName="", title=decodeURI(cookies["analyseName"]).replace(" ","_");

  for(var i=0; i<germlineSequence.cells.length; i++){
    if(germlineSequence.cells[i].className!=prevClassName){
      sequences += ";";
      prevClassName=germlineSequence.cells[i].className;
    }
    sequences += germlineSequence.cells[i].innerHTML;
  }

  for(var i=0; i<sequencesTable.getElementsByTagName('tr').length; i++){
    prevClassName="";
    sequences += "\n";
    for(var j=0; j<sequencesTable.getElementsByTagName('tr')[i].cells.length; j++){
      if(sequencesTable.getElementsByTagName('tr')[i].cells[j].className!=prevClassName){
        sequences += ";";
        prevClassName=sequencesTable.getElementsByTagName('tr')[i].cells[j].className;
      }
    sequences += sequencesTable.getElementsByTagName('tr')[i].cells[j].innerHTML;
    }
  }

  //recover the tree and distance representation
  var svgTree = document.getElementById('chart1').outerHTML;
  var svgDistance = document.getElementById('chart2').outerHTML;
  //create an object in Binary Large Objects format to store the information of the svg representation 
  var blobTree = new Blob([svgTree], {type:"image/svg+xml;charset=utf-8"});
  var blobDistance = new Blob([svgDistance], {type:"image/svg+xml;charset=utf-8"});
  var blobSequences = new Blob([sequences], {type : 'text/plain' });

  //create an object to generate the zip file
  var zip = new JSZip();
  //add the two images and the table in the zip object
  zip.file(clone+"_length_tree("+title+").svg",blobTree,{base64: true});
  zip.file(clone+"_distance("+title+").svg",blobDistance,{base64: true});
  zip.file(clone+"_sequences("+title+").csv",blobSequences,{base64: true});

  //generate the zip file asynchronously
  zip.generateAsync({type:"blob"}).then(function(content) {
    saveAs(content, title+"_intraclonal_study.zip");
  });

}
