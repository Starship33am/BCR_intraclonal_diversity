<?php
  require_once('class/tools.php');

  $userFile = $_COOKIE['Userfile'];
  echo "<!DOCTYPE html><html>";
  echo debut_html("ViCoD - Repertoire");
  echo "<body>";

  $bdd = new PDO('mysql:host=localhost;dbname=BCRVisualization;charset=utf8', 'users', 'BCRVisualizati0n!');
  $state = 'SELECT firstStep FROM users WHERE userID='.$userFile; // statute of the user 
  $query = $bdd->query($state);
  $regroupement = $query->fetch()["firstStep"];

  //the clonal regroupement with GTM has been done 
  if ($regroupement=='done') {
    //search if a job is running for the tree
    $inProgress = 'SELECT userID FROM users WHERE secondStep="in progress"';
    $query = $bdd->query($inProgress);
  echo"hey";
    //if not the data of this user can be analysed if he is the first in the list
    if($query->fetch()==null){
      //Is this user the first in the list?
      $waiting = 'SELECT userID FROM users WHERE secondStep="waiting"';
      $result = $bdd->query($waiting);
      $id=($result->fetch()["userID"]);  //select the first user in the list

      //this user is the first in the list
      if($id==$userFile){
        $update='UPDATE users SET secondStep="in progress" WHERE userID='.$userFile;  //modify the statute of the user from "waiting" to "in progress"
        $query = $bdd->query($update); 
        //disconnect from the database
        $result = null;
        $query = null;
        $bdd = null;

        $numClone = 1;
        //intraclonal study
        $cmd = '/bin/bash /var/www/html/IntraclonalDiversity/pipeline/tree/run_tree.sh '.$userFile.' '.$numClone.' > /dev/null&';
        exec($cmd, $output);
      
        //waiting page
        header('Location: clone.php');
        exit();

      //load the visualization page of the data analysed
      //include('includes/clone.html');

      //This user is not the first in the list
      }else{
        //disconnect from the database
        $result = null;
        $query = null;
        $bdd = null;
        //refresh the page every 10 seconds to see if a job is finished
        header ("Refresh: 10; URL=tree.php");
        echo "<p class='wait' >", "Please wait a moment, your data will be processed", "</p>";
      }

    //A job is curently running
    }else{
      //disconnect from the database
      $result = null;
      $query = null;
      $bdd = null;
      header ("Refresh: 10; URL=tree.php"); 
      echo "<p class='wait' >", "Please wait a moment, your data are being processed", "</p>";
    }
  //clonal regroupement has not been done
  }else{
    header ("Refresh: 10; URL=tree.php");
    include('includes/waiting.html');
  }

  echo "</body></html>";

?>
