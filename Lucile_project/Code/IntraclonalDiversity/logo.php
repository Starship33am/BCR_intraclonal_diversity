<?php
  $title = "ViCloD - Logo";
  require_once __DIR__ . DIRECTORY_SEPARATOR . 'elements' . DIRECTORY_SEPARATOR . 'header.php';
  require_once __DIR__ . DIRECTORY_SEPARATOR . 'elements' . DIRECTORY_SEPARATOR . 'functions.php';
  $exampleID = ['sc1_BORJ','sc2_DUMJ','V100_RAVC','Vmut_KARG'];

  if(!empty($_POST['user'])){
    $userFile = secureData($_POST['user']);
    if(is_numeric($userFile) || in_array($userFile, $exampleID)){
      if(is_numeric($_POST['start']) && is_numeric($_POST['end'])) {
        $start = secureData($_POST['start']);
        $end = secureData($_POST['end']);
        $length = ($end - $start)+1;
        if(isset($_POST['clonotypeName'])){
          $clonotypeName = secureData($_POST['clonotypeName']);
        }else{
          $clonotypeName = "1";
        }
        if(!file_exists("pipeline/usersFiles/${userFile}/Output/${userFile}_${clonotypeName}_200_logo.svg")){
          $cmd = "/bin/bash /var/www/html/ViCloD/pipeline/dataProcessing/biologo/run_biologo.sh $userFile $clonotypeName $start $length";
          exec($cmd, $output);
        }
        echo "<h3 id='titleAnalysis'>C{$clonotypeName} clone cdr3 logo</h3><br><br>";
        echo "<div style='width: 100%; height: 800px;'>";
        echo "<center><img src='pipeline/usersFiles/{$userFile}/Output/{$userFile}_${clonotypeName}_200_logo.svg' /></center>";
      }else{
        echo '<script type="text/javascript">window.alert("No found");</script>';
      }
    }else{
      echo '<script type="text/javascript">window.alert("No found");</script>';
    }
  require_once __DIR__ . DIRECTORY_SEPARATOR . 'elements' . DIRECTORY_SEPARATOR . 'footer.php';
  }

?>
