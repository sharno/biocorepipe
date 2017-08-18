<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../ajax/dbfuncs.php");

$query = new dbfuncs();

if (isset($_GET['p'])){$p = $_GET['p'];}
if (isset($_GET['q'])){$q = $_GET['q'];}
if (isset($_GET['id'])){$id = $_GET['id'];}
if (isset($_GET['data'])){$data = $_GET['data'];}


if($p == "getProtocols")
{	
    $time="";
	
	// Deleting the protocol
	if(isset($q) && $q == "del"){
		$data2=$query->deleteDat("
    DELETE FROM biocore.ngs_protocols WHERE id=$id
    ");}
	
	// Updating the protocol
	else if(isset($q) && $q == "update"){
		$id = (int)$data[0]; // id
		$name = strip_tags($data[1]); // name
		$growth = strip_tags($data[2]); // growth
		$treatment = strip_tags($data[3]); // treatment
		$user = strip_tags($data[4]); // user name

		$data2=$query->deleteDat("
			UPDATE biocore.ngs_protocols SET name= ".'"'.$name.'"'."
			, growth= ".'"'.$growth.'"'."
			, treatment= ".'"'.$treatment.'"'."
			, date_modified= ".'"'.date("Y-m-d H:i:s").'"'."
			, last_modified_user= ".'"'.$user.'"'."
			WHERE id=$id
			");
	}
	
	// Adding new protocol
	else if(isset($q) && $q == "add"){
		$id = (int)$data[0]; // id
		$name = strip_tags($data[1]); // name
		$growth = strip_tags($data[2]); // growth
		$treatment = strip_tags($data[3]); // treatment
		$user = strip_tags($data[4]); // user name

		$data2=$query->deleteDat("
			INSERT INTO biocore.ngs_protocols 
			(name, growth, treatment,last_modified_user,date_modified)
			VALUES (".
			'"'.$name.'",'.
			'"'.$growth.'",'.
			'"'.$treatment.'",'.
			'"'.$user.'",'.
			'"'.date("Y-m-d H:i:s").'"'.")
			");
	}
	
    if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
    $data=$query->queryTable("
    SELECT id, name, growth, treatment, last_modified_user
    FROM biocore.ngs_protocols $time
    ");	
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
