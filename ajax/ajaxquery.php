<?php
error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../ajax/dbfuncs.php");

$db = new dbfuncs();

//$id = $_REQUEST["id"];
//$p = $_REQUEST["p"];  
$id = isset($_REQUEST["id"]) ? $_REQUEST["id"] : "";
$p = isset($_REQUEST["p"]) ? $_REQUEST["p"] : "";
$start = NULL;
$end = NULL;
if (isset($_REQUEST["start"])) {
	$start = $_REQUEST["start"];
	$end = $_REQUEST["end"];
}
if (isset($_REQUEST["type"])) {
    $type = $_REQUEST["type"];
}
if (isset($_REQUEST['id'])) {
    $id = $_REQUEST['id'];
}

if ($p=="getNetwork"){
    $data = $db -> getNetwork($id);
}
if ($p=="createNextflow"){
	$data = $db -> getNextflow($id);
}
if ($p=="updatePipelineProcessParameter") //(2)  Matching saglandiktan sonra $name PipelineProcessParameter tablosunda yenilenir.
{
    
	if (!empty($id)) {
			$name = $_REQUEST['name'];
       $data = $db->updatePipelineProcessParameterout($id, $name);
    } else {
			$pipeline_id = $_REQUEST['pipeline_id'];
			$parameter_id = $_REQUEST['parameter_id'];
			$name = $_REQUEST['name'];
			$process_name = $_REQUEST['process_name'];
			$type = $_REQUEST['type'];
		$data = $db->updatePipelineProcessParameterin($name, $pipeline_id, $parameter_id, $process_name, $type);
    }
	

}
if ($p=="insertmatchid") //(2)  yeni match eklemek icin kullanilir.
{
    $id1 = $_REQUEST['id1'];
    $id2 = $_REQUEST['id2'];
    $data = $db->insertmatchid($id1, $id2);
}

if ($p=="updatebymatchid") //(2)  match datasini kullanarak pipeline_process_parameter tablosunu update eder.
{
    $name = $_REQUEST['name'];
    $ppp_id = $_REQUEST['ppp_id'];
    $data = $db->updatebymatchid($name, $ppp_id);
}

else if ($p=="getAllParameters"){
    $data = $db -> getAllParameters($start, $end);
}
else if ($p=="getAllPipelines"){
    $data = $db -> getAllPipelines($start, $end);
}
else if ($p=="getAllProcesses"){
    $data = $db -> getAllProcesses($start, $end);
}
else if ($p=="getAllProcessParameters"){
   $process_id = $_REQUEST["process_id"];
   $data = $db->getAllProcessParameters($process_id, $type, $start, $end);
}
else if ($p=="getAllProcessParametersDetail"){  //(2)processdeki parametrelerin detaylarini almak için fonksiyon
   $process_id = $_REQUEST["process_id"];
   $data = $db->getAllProcessParametersDetail($process_id, $start, $end);
}
else if ($p=="removeParameter"){
    $db->removeProcessParameterByParameterID($id);
    $data = $db->removeParameter($id);
}	
else if ($p=="removePipeline"){   
    $db->removePipelineProcessByPipelineID($id);
	$data = $db -> removePipeline($id);
}
else if ($p=="removePipelineProcess"){   //(1)name eklendi
	$process_id = $_REQUEST['process_id'];
    $pipeline_id = $_REQUEST['pipeline_id'];
	$name = $_REQUEST['name'];
	$data = $db -> removePipelineProcess($process_id, $pipeline_id, $name);
}
else if ($p=="removeProcess"){   
    $db->removeProcessParameterByProcessID($id);
    $db->removePipelineProcessByProcessID($id);
	$data = $db -> removeProcess($id);
}
else if ($p=="removeProcessParameter"){   
	$data = $db -> removeProcessParameter($id);
}
else if ($p=="saveParameter"){
    $name = $_REQUEST['name'];
    $qualifier = $_REQUEST['qualifier'];
    $channel_name = $_REQUEST['channel_name'];
    $input_text = $_REQUEST['input_text'];
    $file_path = $_REQUEST['file_path'];
    $file_type = $_REQUEST['file_type'];
    $version = $_REQUEST['version'];
    
    if (!empty($id)) {
       $data = $db->updateParameter($id, $name, $qualifier, $channel_name, $input_text, $file_path, $file_type, $version);
    } else {
       $data = $db->insertParameter($name, $qualifier, $channel_name, $input_text, $file_path, $file_type, $version);
    }
}
else if ($p=="savePipeline"){
    $name = $_REQUEST['name'];
    $version = $_REQUEST['version'];
    if (!empty($id)) {
        $data = $db->updatePipeline($id, $name, $version);
    } else {
        $data = $db->insertPipeline($name, $version);
    }
}
else if ($p=="saveProcess"){
    $name = $_REQUEST['name'];
    $version = $_REQUEST['version'];
    $script = $_REQUEST['script']; 
    if (!empty($id)) {
        $data = $db->updateProcess($id, $name, $version, $script);
    } else {
        $data = $db->insertProcess($name, $version, $script);
    }
}
else if ($p=="savePipelineProcess"){
    $name = $_REQUEST['name'];
    $pipeline_id = $_REQUEST['pipeline_id'];
    $process_id = $_REQUEST['process_id'];
    $data = $db->insertPipelineProcess($name, $pipeline_id, $process_id);
}
else if ($p=="saveProcessParameter"){
    $name = $_REQUEST['name'];
    $process_id = $_REQUEST['process_id'];
    $parameter_id = $_REQUEST['parameter_id'];
    $type = $_REQUEST['type'];
    
    $data = $db->insertProcessParameter($name, $process_id, $parameter_id, $type);
}

else if ($p=="savePipelineProcessParameterDefault") //(2)  savePipelineProcessParameter yerine savePipelineProcessParameterDefault yazildi.
{
    $pipeline_id = $_REQUEST['pipeline_id'];
    $process_id = $_REQUEST['process_id'];
    $name = $_REQUEST['name'];
    
    $data = $db->insertPipelineProcessParameterDefault($name, $pipeline_id, $process_id);
}
else if ($p=="getProcessData")
{
	$id = $_REQUEST['process_id'];
    $data = $db->getProcessData($id);
}
else if ($p=="getInputs")
{
	$process_id = $_REQUEST['process_id'];
    $data = $db->getInputs($process_id);
}
else if ($p=="getOutputs")
{
	$process_id = $_REQUEST['process_id'];
    $data = $db->getOutputs($process_id);
}
else if ($p=="getParametersData")
{
    $data = $db->getParametersData();
}
else if ($p=="saveAllPipeline")
{
	$dat = $_REQUEST['dat'];
    $data = $db->saveAllPipeline($dat);
}
else if ($p=="getSavedPipelines")
{
    $data = $db->getSavedPipelines();
}

else if ($p=="loadPipeline")
{
	$id = $_REQUEST['id'];
    $data = $db->loadPipeline($id);
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
