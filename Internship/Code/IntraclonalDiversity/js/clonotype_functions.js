//browse the tree of clonotypes to find the 5 first clonotypes with the most abundance
function findMostAbundantClonotypes(node, table){
  var longestTreeBranch = [0,{"sum":0,"nodeAbundance":0},{"sum":0,"nodeAbundance":[]}], lengthBranch = [], nodeSize = [], maxNodeSize = [], nodeAbundance = [[],[]];
  //for each children of the given node 
  for(var i in node.children){
    //the node is not silent
    if(node.children[i].data["name"][0]=="C"){
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
  if(abundanceLongestBranch.sumNodeSize>=highestAbundance.sumNodeSize && abundanceLongestBranch.sumNodeSize<height){
    return abundanceLongestBranch.sumNodeSize;
  }else if(highestAbundance.sumNodeSize>abundanceLongestBranch.sumNodeSize && highestAbundance.sumNodeSize<height){
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

    var th1 = document.createElement('th');
    th1.appendChild(document.createTextNode(regionName));
    th1.colSpan = nbr;

  for(var i in column){

    var th2 = document.createElement('th');
    var th3 = document.createElement('th');

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

//store the data of the sequence of the file in an array
function sequenceData(data){
  var tableau = [];
  var seq = data.split("\n");
  for(var i in seq){
    var element = seq[i].split("	");
        if(element.length==11){
tableau.push({"name":element[0],"abundance":element[1],"identity":element[2],"V_mutation":element[3],"fwr1":element[4],"cdr1":element[5],"fwr2":element[6],"cdr2":element[7],"fwr3":element[8],"cdr3":element[9],"fwr4":element[10]})
        }
  }
  return tableau;
}


function childClonotypeSequence(data,table,header){
  var classColumn = ["firstColumn","secondColumn","thirdColumn","fourthColumn"]
  //browse the clones and show the sequences for each of them
  for(var i in data){ 
    //if(clonotypesNames.indexOf(data[i]["name"])!=-1){

      //create a tr element to add a line and add it to the table
      var tr = document.createElement('tr');
      table.appendChild(tr);

      //create a th element to add a cell that contain the name, the abundance and the percentage of identity
      for (var j=0; j<4; j++){
        var td1 = document.createElement('td');
        td1.appendChild(document.createTextNode(data[i][header[j]]));
        td1.classList = classColumn[j];
        tr.appendChild(td1);
      }

      //add to the table the different region of the sequences (fwr1, cdr1, fwr2, ...)
      for (var j=4; j<header.length; j++){
        for(var h in data[i][header[j]]){
          //create a td element to add a cell that contain the sequence
          var td2 = document.createElement('td');
          td2.classList = header[j].substring(0,3);
          td2.appendChild(document.createTextNode(data[i][header[j]][h]));
          tr.appendChild(td2);
        }
      }

    //}
  }

}

//adaptation of quickstart algorithm to sort the rows of the table
function partition(rows,start,end,index){
  var k=start;
  for(var i=start+1; i<=end; i++){
    var td1 = rows[k].getElementsByTagName("td")[index];
    var td2 = rows[i].getElementsByTagName("td")[index];
    if(index==0){
      var value1 = parseFloat(td1.innerHTML.split("-")[1])
      var value2 = parseFloat(td2.innerHTML.split("-")[1])
      if(value2<value1){
        rows[start].parentNode.insertBefore(rows[i], rows[k]);
        k++;
      }
    }else{
      var value1 = parseFloat(td1.innerHTML.split("(")[0])
      var value2 = parseFloat(td2.innerHTML.split("(")[0])
      if(value2>value1){
        rows[start].parentNode.insertBefore(rows[i], rows[k]);
        k++;
      }
    }
  }
  return k;
}

function sortRowOfTable(rows, start, end, index){
  if(end>start){
    pivot = partition(rows, start, end, index);
    sortRowOfTable(rows, start, (pivot-1), index);
    sortRowOfTable(rows, (pivot+ 1), end, index);
  }
}

//sort the data of the table depending on the column selected
function sortSequences(event){
  columns = ["firstColumn","secondColumn", "thirdColumn", "fourthColumn"];
  index = columns.indexOf(event.target.className);
  table = document.getElementById("tableSequence").tBodies;
  rows = table[0].children;
  sortRowOfTable(rows, 0, rows.length-1, index);
}

/* ******************************************** download clonotype informations *************************************************** */

function downloadClonotypesInformations(){
  var germlineSequence = document.getElementById('tableSequence').getElementsByTagName('thead')[0].getElementsByTagName('tr')[2];
  var sequencesTable = document.getElementById('tableSequence').getElementsByTagName('tbody')[0];
  var sequences = "Name	Reads (clonotypes abundance in clone (%))	 All sequence identity (%)	V identity (%)	fwr1	cdr1	fwr2	cdr2	fwr3	cdr3	fwr4\n";
  var prevClassName="firstColumn", title=decodeURI(cookies["analyseName"]).replace(" ","_");

  for(var i=0; i<germlineSequence.cells.length; i++){
    if(germlineSequence.cells[i].className!=prevClassName){
      prevClassName=germlineSequence.cells[i].className;
      sequences += "	";
    }
    sequences += germlineSequence.cells[i].innerHTML;
  }

  for(var i=0; i<sequencesTable.getElementsByTagName('tr').length; i++){
    prevClassName="firstColumn";
    sequences += "\n";
    for(var j=0; j<sequencesTable.getElementsByTagName('tr')[i].cells.length; j++){
      if(sequencesTable.getElementsByTagName('tr')[i].cells[j].className!=prevClassName){
        prevClassName=sequencesTable.getElementsByTagName('tr')[i].cells[j].className;
        sequences += "	";
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
  zip.file(clone+"_sequences("+title+").txt",blobSequences,{base64: true});

  //generate the zip file asynchronously
  zip.generateAsync({type:"blob"}).then(function(content) {
    saveAs(content, title+"_intraclonal_study.zip");
  });

}
