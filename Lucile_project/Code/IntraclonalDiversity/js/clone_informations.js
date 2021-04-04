// ******************************************** Data of the clones and clonotypes ****************************************************

function tableData(data, heading, value){

  //select the div element which will contain the sequences
  var table = document.getElementById('cloneTable');
  //create a thead element and add it to the table
  var thead = document.createElement('thead');
  table.appendChild(thead);
  //create a tr element and add it to the table
  var tr = document.createElement('tr');
  thead.appendChild(tr);

  for(var i in heading){

    //create the title of the column 
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(heading[i]));

    //add the title to the table
    tr.appendChild(th);
    
  }

  //create a tbody element and add it to the table
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);

  //browse the clones and show the sequences for each of them
  for(var i in data){ 

    //create a tr element to add a line and add it to the table
    var tr = document.createElement('tr');
    tbody.appendChild(tr);

    for(var j in value){

      //create a td element to add a cell
      var td = document.createElement('td');
      //create a p element which will contain the data of the clone or clonotype
      var p = document.createElement('p');
      p.classList = "tableSeqCell";
      p.appendChild(document.createTextNode(data[i][value[j]]));
      //add it to the td element
      td.appendChild(p);

      //add all the element created to the table      
         tr.appendChild(td);
    
    }

  }
}


// ******************************* Allows the user to download all the information of the repertoire ********************************

function downloadClonesInformations(){
  var download = "", heading = [], analyseTitle=decodeURI(cookies["analyseName"]).replace(" ","_");
  var fileName, chart1, chart2, svg;

  if("idV" in objectSelected[0]){ 
    fileName = "repertoire";
    chart1 = "("+analyseTitle+").svg";
    chart2 = "_barchart("+analyseTitle+").svg";
    svg = "barChart";
  }else{
    fileName = "clone"+objectSelected[0]["name"].split("-")[0];
    chart1 = "_clonotypes("+analyseTitle+").svg";
    chart2 = "_general_topology("+analyseTitle+").svg";
    svg = "clonotypeTree";
  }

  //recover the title 
  for(var title in objectSelected[0]){
    if(!(title in {"children":"","color":"","stroke":"","style":""})){ 
      heading.push(title); 
      download += title+";";
    }
  }

  download += "\n"
  //add all the clone or clonotype
  for(var i in objectSelected){
    for(var j in heading){
      download += objectSelected[i][heading[j]]+";";
    }
    download += "\n";
  }

  //recover the tree and distance representation
  var svgRepertoire = document.getElementById('chart1').outerHTML;
  var svgTree = document.getElementById(svg).outerHTML;
  //create an object in Binary Large Objects format to store the information of the svg representation 
  var blobRepertoire = new Blob([svgRepertoire], {type:"image/svg+xml;charset=utf-8"});
  var blobTree = new Blob([svgTree], {type:"image/svg+xml;charset=utf-8"});
  var blobData = new Blob([download], {type : 'text/plain' });

//create an object to generate the zip file
var zip = new JSZip();
//add the two images and the table in the zip object
zip.file(fileName+chart1,blobRepertoire,{base64: true});
zip.file(fileName+chart2,blobTree,{base64: true});
zip.file(fileName+"_data("+analyseTitle+").csv",blobData,{base64: true});

//generate the zip file asynchronously
zip.generateAsync({type:"blob"}).then(function(content) {
  saveAs(content, analyseTitle+"_"+fileName+".zip");
});

/*  var textToBLOB = new Blob([download], {type : 'text/plain' });
  var fileSave = fileName+'_data.txt';
  var newLink = document.createElement("a");
  newLink.download = fileSave;
  
  if (window.webkitURL != null) {
    newLink.href = window.webkitURL.createObjectURL(textToBLOB);
  }else{
    newLink.href = window.URL.createObjectURL(textToBLOB);
    newLink.style.display = "none";
    document.body.appendChild(newLink);
  }

  newLink.click();*/

}
