<?php
  require_once('class/tools.php');

  $userFile = $_COOKIE['Userfile'];
  $title = $_COOKIE["title"];
  echo "<!DOCTYPE html><html>";
  echo debut_html("ViCoD - Repertoire");
  echo "<body>";
  include('includes/navbar.html');

  $bdd = new PDO('mysql:host=localhost;dbname=BCRVisualization;charset=utf8', 'users', 'BCRVisualizati0n!');
  $state = 'SELECT secondStep FROM users WHERE userID='.$userFile; // statute of the user 
  $query = $bdd->query($state);
  $tree = $query->fetch()["secondStep"];

  //the intraclonal analyse has been done 
  if ($tree=='done') {
    //disconnect from the database
    $tree = null;
    $query = null;
    $bdd = null;


    //load the visualization page of the data analysed
    include('includes/clone.html');

  //the clonal intraclonal analyse isn't finished
  }else{
    //disconnect from the database
    $tree = null;
    $query = null;
    $bdd = null;
    header ("Refresh: 10; URL=clone.php");
    include('includes/waiting.html');
  }

?>
