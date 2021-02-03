<?php
  require_once('class/tools.php');

  $userFile = $_COOKIE['Userfile'];
  $analyseName = $_COOKIE["analyseName"];
  echo "<!DOCTYPE html><html>";
  echo debut_html("Intraclonal visualization - clonotype");
  echo "<body>";
  include('includes/navbar.html');
  include('includes/clonotype.html');
  echo "</body></html>";
?>
