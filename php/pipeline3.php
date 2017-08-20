<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"></script>
<script src="js/jsfuncs.js"></script>
<script src="js/process.js"></script>

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<style>
.nodisp {display:block}

</style>
    <div class="container">
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-2">
			<select id = "mainProcesses" class ="btn btn-default form-control" name = "MainProcesses" style="width: 100%; margin-top:15px;"></select>
		</div>
		<div class="col-md-2">
			<button type="button" class="btn btn-default btn-success " name="button" onclick="addProcess(675,100)" style="width: auto; margin-top:15px;"><i class="glyphicon glyphicon-edit"></i></button>
			<button type="button" class="btn btn-default btn-info" name="button" onclick="download('nextflow',createNextflowFile())" style="width: auto; margin-top:15px;"><i class="glyphicon glyphicon-save"></i></button>
		</div>
		<div class="col-md-2">
			  <input id = "saveNameInput" class="form-control" type="text" name="saveNameInput" onkeyup="saveReady()" style="width: 100%; margin-top:15px;" placeholder="Enter Name For Save">
		</div>
		<div class="col-md-2">
			<select id = "pipelines" class ="btn btn-default form-control" name = "pipelines" style="width: 100%; margin-top:15px;"></select>
		 </div>
		<div class="col-md-2">
		    <button type="submit" class="btn btn-default btn-success" name="openButton" onclick="openPipeline()" style="width: auto; margin-top:15px;"><i class="glyphicon glyphicon-refresh"></i></button>
            <button id = "saveButton" type="submit" class="btn btn-default btn-danger" name="button" onclick="save()" style="width: auto; margin-top:15px;"><i class="glyphicon glyphicon-ok"></i></button>
	    </div>
		</div>
    </div>
	
	<div id="id01" class="w3-modal">
	<div class="w3-modal-content w3-card-4 w3-animate-zoom">
	 <header class="w3-container w3-blue"> 
	  <span onclick="document.getElementById('id01').style.display='none'" 
	  class="w3-button w3-green w3-xlarge w3-display-topright">&times;</span>
	  <h2>Process</h2>
	 </header>
   
	 <div class="w3-bar w3-border-bottom">
	  <button class="tablink w3-bar-item w3-button" onclick="openPage(event, 'process')">Process</button>
	  <button class="tablink w3-bar-item w3-button" onclick="openPage(event, 'inputs')">Inputs</button>
	  <button class="tablink w3-bar-item w3-button" onclick="openPage(event, 'outputs')">Outputs</button>
	 </div>
   
	 <div id="process" class="w3-container nodisp">
	  <h1 id="process_name"></h1>
	  <div id="process_summary"></div>
	  <div id="process_script"></div>
	 </div>

	 <div id="inputs" class="w3-container nodisp">
		  <div class="panel panel-default" id="pinputpanel">
                        <div class="panel-body">
                            <h4>Input List</h4>
                            <table id="pinputtable" class="table table-striped" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process Name</th>
                                        <th>Version</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process Name</th>
                                        <th>Version</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
	 </div>
   
	 <div id="outputs" class="w3-container nodisp">
				  <div class="panel-body">
                            <h4>Output List</h4>
                            <table id="poutputtable" class="table table-striped" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process Name</th>
                                        <th>Version</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process Name</th>
                                        <th>Version</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
	 </div>
   
	 <div class="w3-container w3-light-grey w3-padding">
	  <button class="w3-btn w3-right w3-white w3-border" 
	  onclick="document.getElementById('id01').style.display='none'">Close</button>
	 </div>
	</div>
   </div>
<div id="container" ondragover="allowDrop(event)"></div>
<script src="js/pipeline.js"></script>
