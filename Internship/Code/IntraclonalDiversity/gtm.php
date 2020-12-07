<?php

  require_once('class/tools.php');

  //setcookie("Userfile", $userFile, "");
  $userFile = $_COOKIE['Userfile'];
  $title = $_COOKIE["title"];
  echo "<!DOCTYPE html><html>";
  echo debut_html("ViCoD - Repertoire");
  echo "<body>";

  //connection to the database
  $bdd = new PDO('mysql:host=localhost;dbname=BCRVisualization;charset=utf8', 'users', 'BCRVisualizati0n!');

  //search if the user already exist in the database
  $inDatabase = 'SELECT userID FROM users WHERE userID=' . $userFile ;
  $query = $bdd->query($inDatabase);
  if($query->fetch()==null){
    //add the user to the database if he isn't already in
    $newUser = 'INSERT INTO users VALUES ( ' . $userFile .', CURDATE(), "waiting", "waiting");' ;
    $bdd->query($newUser);
  }

  //search if a job is running
  $inProgress = 'SELECT userID FROM users WHERE firstStep="in progress"';
  $query = $bdd->query($inProgress);
  
  //if not the data of this user can be analysed if he is the first in the list
  if($query->fetch()==null){
    //Is this user the first in the list?
    $waiting = 'SELECT userID FROM users WHERE firstStep="waiting"';
    $result = $bdd->query($waiting);
    $id=($result->fetch()["userID"]);  //select the first user in the list

    //this user is the first in the list
    if($id==$userFile){
      $update='UPDATE users SET firstStep="in progress" WHERE userID='.$userFile;  //modify the statute of the user from "waiting" to "in progress"
      $query = $bdd->query($update); 
      //disconnect from the database
      $result = null;
      $query = null;
      $bdd = null;

      //clonal and intraclonal grouping with GTM
      $cmd = '/bin/bash /var/www/html/IntraclonalDiversity/pipeline/GTM/run_GTM.sh '.$userFile.' > /dev/null&';
      exec($cmd, $output);
      
      //waiting page
      header('Location: tree.php');
      exit();

    //This user is not the first in the list
    }else{
      //disconnect from the database
      $result = null;
      $query = null;
      $bdd = null;
      //refresh the page every 10 seconds to see if a job is finished
      header ("Refresh: 10; URL=gtm.php");
      echo "<p class='wait' >", "Please wait a moment, your data will be processed", "</p>";
    }

  //A job is curently running
  }else{
    //disconnect from the database
    $result = null;
    $query = null;
    $bdd = null;
    header ("Refresh: 10; URL=gtm.php"); 
    echo "<p class='wait' >", "Please wait a moment, your data are being processed", "</p>";
  }
    

  echo "</body></html>";


?>
