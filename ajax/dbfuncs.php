<?php
require_once("../config/config.php");

class dbfuncs {

    private $dbhost = DBHOST;
    private $db = DB;
    private $dbuser = DBUSER;
    private $dbpass = DBPASS;
    private $dbport = DBPORT;
    private $last_modified_user = LMUSER;
    private static $link;

    function __construct() {
        if (!isset(self::$link)) {
            self::$link = new mysqli($this->dbhost, $this->dbuser, $this->dbpass, $this->db, $this->dbport);
            // check connection
            if (mysqli_connect_errno()) {
                exit('Connect failed: ' . mysqli_connect_error());
            }
        }
    }

    function __destruct() {
        if (isset(self::$link)) {
            self::$link->close();
        }
    }
   function runSQL($sql)
   {
        $link = new mysqli($this->dbhost, $this->dbuser, $this->dbpass, $this->db);
        // check connection
        if (mysqli_connect_errno()) {
                exit('Connect failed: '. mysqli_connect_error());
        }
        $result=self::$link->query($sql);
		if (!$result) {
            trigger_error('Database Error: ' . self::$link->error);
        }
        if ($result && $result!="1")
        {
            return $result;
        }
        return json_encode (json_decode ("{}"));
   }
   function queryTable($sql)
   {
     $data = array();
     if ($res = $this->runSQL($sql))
     {
        while(($row=$res->fetch_assoc())){$data[]=$row;}
        $res->close();
     }
     return json_encode($data);
   }
   
   function insTable($sql)
   {
	 $data = array();

     if ($res = $this->runSQL($sql))
     {
		$insertID = self::$link->insert_id;
		$data = array('id' => $insertID);
     }
     return json_encode($data);
   }
    public function getAllParameters($start, $end) {
        $data = array();
        $time = "";
        if (!empty($start)) {
            $time = "WHERE date_created >= '$start' AND date_created < ('$end' + INTERVAL 1 DAY)";
        }
        $sql = "SELECT id, name, qualifier, channel_name, input_text, file_path, file_type, version
    			FROM parameter $time";
        return self::queryTable($sql);
    }

    public function insertParameter($name, $qualifier, $channel_name, $input_text, $file_path, $file_type, $version) {
        $sql = "INSERT INTO parameter(name, qualifier, channel_name, file_path, file_type, version,
		    input_text, date_created, date_modified, last_modified_user) VALUES 
			('$name', '$channel_name', '$file_type', '$file_path', '$version',
			'$qualifier', '$input_text', now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }

    public function updateParameter($id, $name, $qualifier, $channel_name, $input_text, $file_path, $file_type, $version) {
        $sql = "UPDATE parameter SET name='$name', 
			qualifier='$qualifier', channel_name='$channel_name', last_modified_user ='".$this->last_modified_user."',
			input_text='$input_text', file_path='$file_path', file_type='$file_type', version='$version'  WHERE id = $id";
        return self::runSQL($sql);
    }

    public function removeParameter($id) {
        $sql = "DELETE FROM parameter WHERE id = '$id'";
        return self::runSQL($sql);
    }

    // --------- Process -----------

    public function getAllProcesses($start, $end) {
        $time = "";
        if (!empty($start)) {
            $time = "WHERE date_created >= '$start' AND date_created < ('$end' + INTERVAL 1 DAY)";
        }
        $sql = "SELECT id, name, version, script FROM process $time";
        return self::queryTable($sql);
    }

    public function insertProcess($name, $version, $script) {
        $sql = "INSERT INTO process(name, version, script, date_created, date_modified, last_modified_user) VALUES 
			('$name', '$version', '$script', now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }

    public function updateProcess($id, $name, $version, $script) {
        $sql = "UPDATE process SET name= '$name', version='$version',
		        script='$script', last_modified_user = '".$this->last_modified_user."'  WHERE id = $id";
        return self::runSQL($sql);
    }

    public function removeProcess($id) {
        $sql = "DELETE FROM process WHERE id = $id";
        return self::runSQL($sql);
    }

    // ------- Process Parameters ------

    public function getAllProcessParameters($process_id, $type, $start, $end) {
        $time = "";
        if (!empty($start)) {
            $time = "date_created >= '$start' AND date_created < ('$end' + INTERVAL 1 DAY)";
        }

        $typeExp = "";
        if (!empty($type)) {
            $typeExp = "AND type = '$type'";
        }

        $sql = "SELECT pp.id, pp.name, p.name process_name, p.version, type FROM process p, process_parameter pp 
                WHERE pp.process_id = $process_id $typeExp AND pp.process_id = p.id";
        return self::queryTable($sql);
    }
 
    public function getAllProcessParametersDetail($process_id, $start, $end) { //(2) processdeki parametrelerin detaylarini parameter tablosundan almak için fonksiyon
        $time = "";
        if (!empty($start)) {
            $time = "date_created >= '$start' AND date_created < ('$end' + INTERVAL 1 DAY)";
        }
		
        $typeExp = "";
        if (!empty($type)) {
            $typeExp = "AND type = '$type'";
        }
       
        $sql = "select para.*, propara.type from parameter para
                join process_parameter propara on para.id = propara.parameter_id                  
                where propara.process_id = '$process_id' $typeExp"; //(2) parameter ve process_parameters tablolari birlestirlir ve cekilir.
        
        return self::queryTable($sql);
    }

    public function insertProcessParameter($name, $process_id, $parameter_id, $type) {
        $sql = "INSERT INTO process_parameter(name, process_id, parameter_id,
		    type, date_created, date_modified, last_modified_user) VALUES 
			('$name', $process_id, $parameter_id, '$type', now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }

    public function removeProcessParameter($id) {
        $sql = "DELETE FROM process_parameter WHERE id = $id";
        return self::runSQL($sql);
    }

    public function removeProcessParameterByParameterID($parameter_id) {
        $sql = "DELETE FROM process_parameter WHERE parameter_id = $parameter_id";
        return self::runSQL($sql);
    }

    public function removeProcessParameterByProcessID($process_id) {
        $sql = "DELETE FROM process_parameter WHERE process_id = $process_id";
        return self::runSQL($sql);
    }

    // --------------- Pipeline ---------------

    public function insertPipeline($name, $version) {
        $sql = "INSERT INTO pipeline VALUES 
			(DEFAULT, '$name', '$version', now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }

    public function getAllPipelines($start, $end) {
        $data = array();

        $time = "";
        if (!empty($start)) {
            $time = "WHERE date_created >= '$start' AND date_created < ('$end' + INTERVAL 1 DAY)";
        }
        $sql = "SELECT id, name, version FROM pipeline $time";
        return self::queryTable($sql);
    }

    public function removePipeline($id) {  //matchid tablosundaki verileri silmek icin sql eklendi.
		$sql = "DELETE mi
				FROM matchid mi
				JOIN pipeline_process_parameter ppp ON (ppp.id = mi.id1 or ppp.id = mi.id2 )
				WHERE ppp.pipeline_id = $id ";
        self::runSQL($sql);
		
        $sql = "DELETE FROM pipeline WHERE id = $id";
        return self::runSQL($sql);
    }

    //------------- Pipeline Process Definitions------------

    public function insertPipelineProcess($name, $pipeline_id, $process_id) {
        $sql = "INSERT INTO pipeline_process(pipeline_id, process_id, name, date_created, date_modified, last_modified_user)
		   VALUES ($pipeline_id, $process_id, '$name', now(), now(), '".$this->last_modified_user."')";
       return self::insTable($sql);
    }

    public function removePipelineProcess($process_id, $pipeline_id, $name) {  //(2)matchid, pipeline_process_parameter ve pipeline_process tablolarindan beraber veri siler.
		$sql = "DELETE mi
				FROM matchid mi
				JOIN pipeline_process_parameter ppp ON (ppp.id = mi.id1 or ppp.id = mi.id2 )
				WHERE ppp.process_id = $process_id AND ppp.pipeline_id = $pipeline_id AND ppp.process_name = '$name'";
        self::runSQL($sql);
		
		$sql = "DELETE FROM pipeline_process_parameter WHERE process_id = $process_id AND pipeline_id = $pipeline_id AND process_name = '$name'";
        self::runSQL($sql);
		
		$sql = "DELETE FROM pipeline_process WHERE process_id = $process_id AND pipeline_id = $pipeline_id AND name = '$name'";
        return self::runSQL($sql);
		
    }
    public function removePipelineProcessByProcessID($process_id) { //(2)pipeline_process_parameter ve pipeline_process tablolarindan beraber veri siler.
		$sql = "DELETE FROM pipeline_process_parameter WHERE process_id = $process_id";
        self::runSQL($sql);
		
        $sql = "DELETE FROM pipeline_process WHERE process_id = $process_id";
        return self::runSQL($sql);
    }

    public function removePipelineProcessByPipelineID($pipeline_id) { //(2)matchid, pipeline_process_parameter ve pipeline_process tablolarindan beraber veri siler.
		$sql = "DELETE mi
				FROM matchid mi
				JOIN pipeline_process_parameter ppp ON (ppp.id = mi.id1 or ppp.id = mi.id2 )
				WHERE ppp.pipeline_id = $pipeline_id ";
        self::runSQL($sql);
		
		$sql = "DELETE FROM pipeline_process_parameter WHERE pipeline_id = $pipeline_id";
		self::runSQL($sql);
        $sql = "DELETE FROM pipeline_process WHERE pipeline_id = $pipeline_id";
        return self::runSQL($sql);
    }
    
    // ------------- Pipeline Process Parameters ---------- (input parameter ile musait outputlar match edildikten sonra name kolonunda saklanir
    
    
    public function insertPipelineProcessParameterDefault($name, $pipeline_id, $process_id) {  //(2)hem pipeline_process'e hem de pipeline_process_parameter tablosuna veri ekler.
        
        $sql = "INSERT INTO pipeline_process(pipeline_id, process_id, name, date_created, date_modified, last_modified_user)
		   VALUES ($pipeline_id, $process_id, '$name', now(), now(), '".$this->last_modified_user."')";
        
        self::insTable($sql);
                
		$sql = "INSERT INTO pipeline_process_parameter(pipeline_id, process_id, parameter_id, name, process_name, type, date_created, date_modified, last_modified_user)
                    SELECT DISTINCT $pipeline_id, $process_id, pp.parameter_id, '$name', '$name', pp.type, now(), now(), '".$this->last_modified_user."'
                    from biocorepipe.process_parameter pp
                    where pp.process_id = $process_id ";
       return self::insTable($sql);
    }

	//input parameter(updatePipelineProcessParameterin) ile file-type uygun nodelar(updatePipelineProcessParameterout) match edildikten sonra esleme ismi name kolonunda saklanir
    public function updatePipelineProcessParameterin($name, $pipeline_id, $parameter_id, $process_name, $type) {   
		$sql = "UPDATE  pipeline_process_parameter SET name='$name'
				WHERE pipeline_id=$pipeline_id AND parameter_id=$parameter_id AND process_name='$process_name' AND type='$type'"; 
		self::runSQL($sql);
	   
		$sql = "SELECT id as id
				FROM pipeline_process_parameter 
				WHERE pipeline_id=$pipeline_id AND parameter_id=$parameter_id AND process_name='$process_name' AND type='$type'";
		return self::queryTable($sql);
	   
	}
	    
	public function updatePipelineProcessParameterout($id, $name) {   
		$sql = "UPDATE  pipeline_process_parameter  SET name='$name'
				WHERE id=$id "; 
		self::runSQL($sql);
	   
		$sql = "SELECT id 
				FROM pipeline_process_parameter 
				WHERE id=$id ";
		return self::queryTable($sql);
	   
	   }

	   public function updatebymatchid($name, $ppp_id) {   //(2) matchid ciftlerine gore pipeline_process_parameter update edilir.
	   	$sql = "UPDATE  pipeline_process_parameter ppp 
		JOIN  matchid mi ON (ppp.id = mi.id1 or ppp.id = mi.id2 )
		SET ppp.name='$name'
		WHERE id1=$ppp_id OR id2=$ppp_id";
		return self::runSQL($sql);
	   }
	   
	   
	   
    public function insertmatchid($id1, $id2) {   //(2) yeni matchid ciftleri eklenir.
        $sql = "INSERT INTO matchid(id1, id2)
		   VALUES ($id1, $id2)";
       return self::insTable($sql);
    }
    
    
    // ------------- Pipeline Diagram -------------

    public function getNetwork($id) {
        $data = array();
		
//(1,2) network olusturulurken gerekli ppp tablosuna ait parametreler eklendi. 

        $sql = "select DISTINCT pi.id as id,
                pro.id as process_id,
                pro.name as process_name,
                propara.type as type,
				propara.parameter_id as parameter_id,
                para.id as parameter_id,
                para.name as parameter_name,
                ppp.id as ppp_id,
                ppp.name as ppp_name, 
                ppp.process_id as ppp_process_id,
                ppp.pipeline_id as ppp_pipeline_id,
                ppp.parameter_id as ppp_parameter_id,
				ppp.process_name as ppp_process_name,
				ppp.type as ppp_type

                FROM pipeline pi, pipeline_process pipro, process pro, process_parameter propara, parameter para,
                     pipeline_process_parameter ppp
                WHERE pi.id = pipro.pipeline_id AND pipro.process_id = pro.id AND pro.id = propara.process_id
                AND ppp.process_id = propara.process_id AND ppp.pipeline_id = pi.id AND ppp.type = propara.type 
                AND ppp.parameter_id = para.id AND propara.parameter_id = para.id
                AND pi.id = '$id'";
        return self::queryTable($sql);
    }

    // --------- Nextflow -------------
	
//(1,2) Nextflow olusturulurken gerekli ppp tablosuna ait parametreler eklendi. 
    public function getNextflow($id) {
        $data = array();

        $sql = "SELECT DISTINCT pi.id as pipeline_id,
                pro.id as process_id,
                pro.name as process_name,
                pro.script as process_script,
                propara.name as process_parameter_name,
                propara.type as process_parameter_type,
                para.id as parameter_id,	
                para.name as parameter_name,
                para.channel_name as parameter_channel_name,
                para.file_path as parameter_file_path,
                para.qualifier as parameter_qualifier,
                para.input_text as parameter_input_text,
				para.file_type as file_type,
				para.version as version,
				ppp.id as ppp_id,
                ppp.name as ppp_name, 
                ppp.pipeline_id as ppp_pipeline_id,
                ppp.parameter_id as ppp_parameter_id,
				ppp.process_id as ppp_process_id,
				ppp.process_name as ppp_process_name,
				ppp.type as ppp_type
				
                FROM pipeline pi, process pro, process_parameter propara, parameter para,
					 pipeline_process_parameter ppp
                WHERE pro.id = propara.process_id AND ppp.parameter_id=para.id
				AND ppp.pipeline_id = pi.id AND ppp.process_id=pro.id AND ppp.type=propara.type
                AND propara.parameter_id = para.id AND pi.id = '$id'";
        return self::queryTable($sql);
    }
	
	
// --------- New Pipeline -----------

	public function getProcessData($id) {
		$where = ""; 
		if ($id != ""){
			$where = " where id = $id";
		}
		$sql = "SELECT id, name, version, summary, script FROM process $where";
		return self::queryTable($sql);
	}
	
	public function getInputs($id) {
		$sql = "SELECT parameter_id, name FROM process_parameter where process_id = $id and type = 'input'";
		return self::queryTable($sql);
	}
	public function getOutputs($id) {
		$sql = "SELECT parameter_id, name FROM process_parameter where process_id = $id and type = 'output'";
		return self::queryTable($sql);
	}
	
	public function getParametersData() {
		$sql = "SELECT * FROM parameter";
		return self::queryTable($sql);
	}
	
	public function saveAllPipeline($dat) {
		$obj = json_decode($dat);
		$user = "docker";
		$id = $obj[1]->{"id"};
		$edges = "{\'edges\':".json_encode($obj[4]->{"edges"})."}";
		$mainG = "{\'mainG\':".json_encode($obj[3]->{"mainG"})."}";
		$nodes = json_encode($obj[2]->{"nodes"});
		$name =  $obj[0]->{"name"};
	
	    if ($id > 0){
			$sql = "UPDATE biocorepipe_save set edges = '".$edges."',
			    mainG = '".$mainG."', nodes ='".$nodes."' where id = $id";
		}else{
		$sql = "INSERT INTO biocorepipe_save(user, edges, mainG, nodes, name)
				VALUES ('".$user."', '".$edges."', '".$mainG."', '".$nodes."', '".$name."')";
		}
  		return self::insTable($sql);
	}
	public function getSavedPipelines() {
		$sql = "select id, name from biocorepipe_save";
		return self::queryTable($sql);
	}
	
	public function loadPipeline($id) {
		$sql = "select * from biocorepipe_save where id = $id";
	   return self::queryTable($sql);
	}
}
