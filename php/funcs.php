<?php



function getTitle($np)
{
  $ret="";
  if ($np==1){$ret = "Parameters";}
  else if ($np==2){$ret = "Processes";}
  else if ($np==3){$ret = "Pipelines";}
  else if ($np==4){$ret = "New params";}
  else if ($np==5){$ret = "New pipelines";}
  return $ret; 
}

function getPage($np)
{
  if ($np==1){include("php/parameters.php"); }
  else if ($np==2){include("php/processes.php");}
  else if ($np==3){include("php/pipelines.php");}
  else if ($np==4){include("php/newparams.php");}
  else if ($np==5){include("php/pipeline3.php");}
  else {include("php/pipeline3.php");}
}

function getJS($np)
{
  $js = "<script src=\"js/jsfuncs.js\"></script>";
  if ($np==1){$js .= "<script src=\"js/parameters.js\"></script>";}
  else if ($np==2){$js .= "<script src=\"js/process.js\"></script>"; }
  else if ($np==3){
      $js .= "   <script src=\"js/cytoscape.min.js\"></script>
            <script src=\"js/cytoscape-cxtmenu.js\"></script>
            <script src=\"js/cytoscape-panzoom.js\"></script>
            <script src=\"js/FileSaver.js\"></script>
            <script src=\"https://cdn.rawgit.com/cpettitt/dagre/v0.7.4/dist/dagre.min.js\"></script>
            <script src=\"https://cdn.rawgit.com/cytoscape/cytoscape.js-dagre/1.5.0/cytoscape-dagre.js\"></script>
            <script src=\"js/pipeline.js\"></script>";
  }else{
    $js ="";
  }
  return $js;
}


?>
