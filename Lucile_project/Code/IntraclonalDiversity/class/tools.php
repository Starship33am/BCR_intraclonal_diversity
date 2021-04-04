<?php

define('ROOT_FOLDER', '/IntraclonalDiversity');

function debut_html($title){

  return 
  "<head>
   <title> $title </title>

   <link rel='stylesheet' href='" . ROOT_FOLDER . "/css/style.css'> 
   <link rel='stylesheet' href='" . ROOT_FOLDER . "/css/repertoire.css'>    

   <meta http-equiv='Content-Type' content='text/html;charset=utf-8' />\n
   <script src='https://d3js.org/d3.v4.min.js' charset='utf-8'></script>\n
   <script src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js'></script>\n
   <script src='http://cdn.jsdelivr.net/g/filesaver.js'></script>\n
   </head>";
}


?>
