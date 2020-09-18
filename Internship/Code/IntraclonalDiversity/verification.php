<?php
//echo phpinfo();
error_reporting(E_ALL);
ini_set("display_errors", 1);

  require_once('class/tools.php');
  $userFile = (string) rand(0, 1000000);
  $oldMask = umask(0);
  mkdir("pipeline/usersFiles/" . $userFile, 0777,true);
  umask($oldMask);

  //setcookie("Userfile", $userFile, "");
  setcookie('Userfile', $userFile, time() + 365*24*3600, null, null, false, true); 

  echo "<!DOCTYPE html><html>";
  echo debut_html("Intraclonal visualization - Repertoire");
  echo "<body>";

  if(isset($_POST['submit'])){
    $storeFolder = "pipeline/usersFiles/" . $userFile;
    //count total files
    $countFiles = count(array_filter($_FILES['file']['name']));
    if($countFiles==3){
      $files = array(); //contain the path where the files will be store
      for($i=0;$i<$countFiles;$i++){
        $fileName = $_FILES['file']['name'][$i]; 
        $files[$i] = $storeFolder . "/" . $fileName;
        move_uploaded_file($_FILES['file']['tmp_name'][$i], $storeFolder . '/' . $fileName);
      }
      // format error
      $error = checkFastaFile($files[0]);
      if($error==0){
          header('Location: clone.php');
          exit();
      }else{
        echo "<p class='error' >", $error, "</p>";
      }
    }else{
      echo "<p class='error' >", "ERROR:: You should provide tree files", "</p>";
    }
  }

  echo "</body></html>";


  function checkFastaFile($file){
    $pathParts = pathinfo($file);
    $fileName = $pathParts['basename'];
    $fileHandle = fopen($file, "r");
    $seq = ""; 
    while(! feof($fileHandle)){
      $line = fgets($fileHandle);
      if ($line[0]=='>'){
        $header = true;
        $seq = "";
      }else{
        if (!$header && $seq ==""){
          return "ERROR:: File ". $fileName ." in a wrong format, please provide a fasta file";
        }
        $header = false;
        $seq = $seq . rtrim($line);
      }
    }
    fclose($fileHandle);
    return 0;
  }
/*
  function checkIMGTFormat($files){}

  function IMGTSummary($file){
    $pathParts = pathinfo($file);
    $fileName = $pathParts['basename'];
    $fileHandle = fopen($file, "r");
    $header = "Sequence number	Sequence ID	V-DOMAIN Functionality	V-GENE and allele	V-REGION score	V-REGION identity %	V-REGION identity nt	V-REGION identity % (with ins/del events)	V-REGION identity nt (with ins/del events)	J-GENE and allele	J-REGION score	J-REGION identity %	J-REGION identity nt	D-GENE and allele	D-REGION reading frame	CDR1-IMGT length	CDR2-IMGT length	CDR3-IMGT length	CDR-IMGT lengths	FR-IMGT lengths	AA JUNCTION	JUNCTION frame	Orientation	V-DOMAIN Functionality comment	V-REGION potential ins/del	J-GENE and allele comment	V-REGION insertions	V-REGION deletions	Sequence	5prime trimmed-n nb	3prime trimmed-n nb	Analysed sequence length	Sequence analysis category	";
    $line=fgets($fileHandle);
    if($line==header){
      $line=fgets($fileHandle);
      
    }
  }

  function IMGTGap($file){
    Sequence number	Sequence ID	V-DOMAIN Functionality	V-GENE and allele	J-GENE and allele	D-GENE and allele	V-D-J-REGION	V-J-REGION	V-REGION	FR1-IMGT	CDR1-IMGT	FR2-IMGT	CDR2-IMGT	FR3-IMGT	CDR3-IMGT	JUNCTION	J-REGION	FR4-IMGT	

  }*/


?>
