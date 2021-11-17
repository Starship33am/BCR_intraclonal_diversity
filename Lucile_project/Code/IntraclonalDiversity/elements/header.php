<?php
  define('ROOT_FOLDER', '/ViCloD');
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <title><?= $title ?? 'ViCloD' ?> </title>

  <link rel='stylesheet' href="<?= ROOT_FOLDER . '/css/style.css' ?>"> 
  <link rel='stylesheet' href="<?= ROOT_FOLDER . '/css/repertoire.css' ?>">    

  <meta http-equiv='Content-Type' content='text/html;charset=utf-8' />
  <script src='https://d3js.org/d3.v4.min.js' charset='utf-8'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js'></script>
  <script src='http://cdn.jsdelivr.net/g/filesaver.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/pdfkit@0.10.0/js/pdfkit.standalone.js'></script>
  <script src='https://bundle.run/blob-stream@0.1.3'></script>
  <script src='https://cdn.jsdelivr.net/npm/svg-to-pdfkit@0.1.8/source.min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/save-svg-as-png/1.4.17/saveSvgAsPng.js'></script>
  <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css' rel='stylesheet'>
</head>

<body>
