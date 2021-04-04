<?php
//echo phpinfo();
error_reporting(E_ALL);
ini_set("display_errors", 1);


  $userFile = (string) rand(0, 1000000);


  if(isset($_POST['submit'])){
    //count total files
    $countFiles = count(array_filter($_FILES['file']['name']));
    $analysisTitle = $_POST['title'];
    //the user has given a title to the analysis
    if(!empty($analysisTitle)){
      //there is 3 files
      if($countFiles==3){
        $oldMask = umask(0);
        mkdir("pipeline/usersFiles/" . $userFile, 0777,true);
        umask($oldMask);
        $storeFolder = "pipeline/usersFiles/" . $userFile;
        $files = array(); //contain the path where the files will be store
        for($i=0;$i<$countFiles;$i++){
          $fileName = $_FILES['file']['name'][$i]; 
          $files[$i] = $storeFolder . "/" . $fileName;
          move_uploaded_file($_FILES['file']['tmp_name'][$i], $storeFolder . '/' . $fileName);
        }
        // format error
        $error = checkFastaFile($files[0]);
        if($error=="fasta"){
          //COOKIES
          setcookie('Userfile', $userFile, time() + 365*24*3600);
          setcookie('analyseName', $analysisTitle, time() + 365*24*3600); 

          header('Location: gtm.php');
          exit();
        }else{
          echo '<script type="text/javascript">window.alert("'. $error .'");</script>';
        }
      }else{
      echo '<script type="text/javascript">window.alert("ERROR:: You should provide tree files");</script>';
      }
    }else{
      echo '<script type="text/javascript">window.alert("ERROR:: You should provide a name to your analysis");</script>';
    }
  }


  function checkFastaFile($file){
    $pathParts = pathinfo($file);
    $fileName = $pathParts['basename'];
    $fileHandle = fopen($file, "r");
    $header = false;
    $seq = "";
    while(!feof($fileHandle)){
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
    return "fasta";
  }



?>
