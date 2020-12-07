<?php
  require_once('class/tools.php');

  $userFile = $_COOKIE['Userfile'];
  $title = $_COOKIE["title"];
  echo "<!DOCTYPE html><html>";
  echo debut_html("Intraclonal visualization - clonotype");
  echo "<body>";
  include('includes/navbar.html');
  include('includes/clonotype.html');
  echo "</body></html>";
?>
