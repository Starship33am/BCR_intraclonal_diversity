/* ***************************************************** SEQUENCES *************************************************************** */

function displaySequence(){

  var user = cookies["Userfile"],
      file = user +"_"+clone.split("C")[1]+"_30_sequences.txt";
      path = "pipeline/usersFiles/"+user+"/Output/"+file;

  d3.text(path, function(error, data) {
    if (error) throw error;

    sequences = sequenceData(data);
    header = sequences.shift();

    var headerName = [" Name ", " Reads (clonotypes abundance in clone (%)) ", " All sequence identity (%) ", " V identity (%) "], title = Object.keys(header);

    //select the div element which will contain the sequences
    var table = document.getElementById('tableSequence');
    var thead = document.createElement('thead');

    table.appendChild(thead);

    var tr1 = document.createElement('tr');
    tr1.classList = "firstRow";
    thead.appendChild(tr1);
    var tr2 = document.createElement('tr');
    tr2.classList = "secondRow";
    thead.appendChild(tr2);
    var tr3 = document.createElement('tr');
    tr3.classList = "thirdRow";
    thead.appendChild(tr3);

    for(var i in headerName){ 

      var classColumn = ["firstColumn","secondColumn","thirdColumn","fourthColumn"]
      var th1 = document.createElement('th');
      var th3 = document.createElement('th');

      th1.appendChild(document.createTextNode(headerName[i]));
      th1.rowSpan = 2;
      th1.addEventListener("click", sortSequences);
      th1.style.cursor = "pointer";
      th1.classList = classColumn[i];
      th3.appendChild(document.createTextNode(header[title[i]]));
      th3.classList = classColumn[i];

      tr1.appendChild(th1);
      tr3.appendChild(th3);

    }

    var cpt = 1;

    for (var i=4; i<title.length; i++){
      cpt = headerInformation(tr1, tr2, tr3, cpt, header[title[i]], title[i].substring(0,3), header[title[i]].length, title[i]);
    }


    //create a tbody element and add it to the table
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    childClonotypeSequence(sequences,tbody,title);
    width = table.rows[0].cells[2].offsetWidth;
    table.getElementsByClassName('firstColumn').top = width;

    //sort the sequences by their name
    var rows = tbody.children;
    sortRowOfTable(rows, 0, rows.length-1, 0);

  });
}
