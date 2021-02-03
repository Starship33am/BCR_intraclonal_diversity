/* ***************************************************** SEQUENCES *************************************************************** */

function displaySequence(names){

  var user = cookies["Userfile"],
      file = user +"_sequences_"+clone+".txt";
      path = "pipeline/usersFiles/"+user+"/tree/"+file;

  d3.text(path, function(error, data) {
    if (error) throw error;

    sequences = sequenceData(data);
    header = sequences.shift();

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

    var th1 = document.createElement('th');
    var th2 = document.createElement('th');
    var th3 = document.createElement('th');

    th1.appendChild(document.createTextNode("Name"));
    th2.appendChild(document.createTextNode(""));
    th3.appendChild(document.createTextNode(header["name"]));

    tr1.appendChild(th1);
    tr2.appendChild(th2);
    tr3.appendChild(th3);

    var cpt = 1;

    cpt = headerInformation(tr1, tr2, tr3, cpt, header["V_region"], "Vregion", [Math.round(header["V_region"].length/2),Math.round(header["V_region"].length/2)], ["V"]);
    cpt = headerInformation(tr1, tr2, tr3, cpt, header["cdr3_region"], "cdr3region", [Math.round(header["cdr3_region"].length/2)-2,Math.round(header["cdr3_region"].length/2)+1], ["C","D","R","3"]);
    cpt = headerInformation(tr1, tr2, tr3, cpt, header["J_region"], "Jregion", [Math.round(header["J_region"].length/2),Math.round(header["J_region"].length/2)], ["J"]);


    //create a tbody element and add it to the table
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    childClonotypeSequence(sequences,tbody, names);    
  });
}
