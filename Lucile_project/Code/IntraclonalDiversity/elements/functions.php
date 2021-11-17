<?php

function nav_item (string $link, string $title, string $navClass)
{
  if($_SERVER['SCRIPT_NAME'] === $link) {
    $navClass .= 'active';
  }
  return <<<HTML
    <li class="$navClass">
      <a href="$link">$title</a>
    </li>
HTML;
}

function nav_menu (string $navClass = '')
{
  return
    nav_item('help.php','Help',$navClass) . 
    nav_item('example.php','Examples',$navClass) . 
    nav_item('analysis.php','Analysis',$navClass) .
    nav_item('index.php','Home',$navClass);
}

function navbar ()
{
  $navbar = nav_menu('menuButton');
  return <<<HTML
    <ul id='menu'>
      <li class='title'>ViCloD : Visualizing intraClonal Diversity</li>
      $navbar
    </ul>
HTML;
}

//secure the incoming data
function secureData($value){
  //remove any html tags
  $value = strip_tags($value);
  $value = htmlentities($value);
  return $value;
}

?>
