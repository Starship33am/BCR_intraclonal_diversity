<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

  require_once('class/tools.php');
  setcookie('Userfile', 'example', time() + 365*24*3600, null, null, false, true); 
  echo "<!DOCTYPE html><html>";
  echo debut_html("Intraclonal visualization - Clone");
  echo "<body>";
  include('includes/navbar.html');
  include('includes/clone.html');
  echo "</body></html>";
?>
