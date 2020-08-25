<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

  require_once('class/tools.php');

  //setcookie("Userfile", $userFile, "");
  $userFile = $_COOKIE['Userfile'];
  echo "<!DOCTYPE html><html>";
  echo debut_html("Intraclonal visualization - Repertoire");
  echo "<body>";

  //connection to the database
  $bdd = new PDO('mysql:host=localhost;dbname=BCRVisualization;charset=utf8', 'users', 'BCRVisualizati0n!');
  //add the user to the database
  $newUser = 'INSERT INTO users VALUES ( ' . $userFile .', CURDATE(), "waiting", "waiting");' ;
  $bdd->query($newUser);
  //is there any job running
  $inProgress = 'SELECT userID FROM users WHERE firstStep="in progress"';
  $query = $bdd->query($inProgress);
  if($query->fetch()==null){
    $waiting = 'SELECT userID FROM users WHERE firstStep="waiting"';
    $result = $bdd->query($waiting);
    $id=($result->fetch()["userID"]);
    if($id==$userFile){
      $update='UPDATE users SET firstStep="in progress" WHERE userID='.$userFile;
      $query = $bdd->query($update);
echo exec('pwd');
      $cmd = '2>&1 /bin/bash /var/www/html/IntraclonalDiversity/pipeline/GTM/run_GTM.sh '.$userFile;
      exec($cmd, $output);
//echo(phpinfo());
echo($cmd);
var_dump($output);
      $update='UPDATE users SET firstStep="done" WHERE userID='.$userFile;
      $query = $bdd->query($update);
      include('includes/clone.html');
    }else{
      header ("Refresh: 10;URL=clone.php");
      echo "<p class='wait' >", "Please wait a moment, your data are being processed", "</p>";
    }
    $result = null;
  }else{
    header ("Refresh: 30;URL=clone.php"); 
    echo "<p class='wait' >", "Please wait a moment, your data are being processed", "</p>";
  }    
  $query = null;
  $bdd = null;
    

  echo "</body></html>";


?>
