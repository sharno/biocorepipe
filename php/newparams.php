
		<!-- Latest compiled and minified JavaScript -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>


    <div class = "row" id = "newParameter" style = "display:none" >
    <div class="col-md-2"></div>
    <div class="col-md-8">
				<div class="col-md-12 text-center"><label>Name</label><br><input type="text" name="name" id ="name" placeholder="Name" class="form-control"></div>
        <div class="col-md-12 text-center" style="margin-top:15px;">
				<label>Qualifier</label><br>
				<select id = "qualifier" class ="btn btn-default dropdown-toggle" name = "qualifier" onchange = "detectKDV()" style="width: 100%">
					<option value = "file" id = "qualifier-0">file</option>
					<option value = "set" id = "qualifier-1">set</option>
					<option value = "val" id = "qualifier-2">val</option>
				</select>
				</div>
				<div class="col-md-12 text-center" style="margin-top:15px"><label>Channel</label><br><input type="text" name="channel" id ="channel" placeholder="Channel" class="form-control" ></div>
				<div class="col-md-12 text-center" style="margin-top:15px"><label>Input Text</label><br><textarea type="text" name="inputtext" id = "inputtext" placeholder="Input Text" class="form-control"></textarea></div>
				<div class="col-md-12 text-center" style="margin-top:15px"><label>File Path</label><br><input type="text" name="filepath" id="filepath" placeholder="File Path" class="form-control"></div>
				<div class="col-md-12 text-center" style="margin-top:15px"><label>File Type</label><br><input type="text" name="filetype" id="filetype" placeholder="File Type" class="form-control"></div>
				<div class="col-md-12 text-center" style="margin-top:15px"><label>Version</label><br><input type="text" name="version" id = "version" placeholder="Version" class="form-control"></div>
			  <div class="col-md-5"></div>
        <div class="col-md-2" style="margin-bottom:30px; margin-top:15px">
        </div>
    </div>
  </div>

		<div class="row" >
			<div class="col-md-1"></div>
			<div class="col-md-10">
				<table class="row text-center table table-hover table-bordered center-table">
					<tr class="info">
						<td class="col-md-1"><label>ID</label></td>
						<td class="col-md-1"><label>Name</label></td>
						<td class="col-md-1"><label>Qualifier</label></td>
						<td class="col-md-1"><label>Channel</label></td>
						<td class="col-md-6"><label>Input Text</label></td>
						<td class="col-md-1"><label>File Path</label></td>
						<td class="col-md-1"><label>File Type</label></td>
						<td class="col-md-1"><label>Version</label></td>
						<td class="col-md-1"><label>Edit/Delete</label></td>
					</tr>
          <tbody id = "tbody">

          </tbody>
				</table>
			</div>
		</div>
		<script>

       var data = "";
       $.ajax({ 
            "url": "ajax/ajaxquery.php",
            "dataSrc": "",
            data: {p: "getAllParameters"},
            success: function(data){
                createTable(data)
            }
        });
        function createTable(data){
            for(i=0; i<data.length; i++){
                  d3.select("#tbody").append("tr").attr("id", "tr-" + data[i].id)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "id-" + data[i]).attr("class", "id").append("text").text(data[i].id)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "name-" + data[i]).attr("class", "name").append("text").text(data[i].name)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "qualifier-" + data[i]).attr("class", "qualifier").append("text").text(data[i].qualifier)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "channel_name-" + data[i]).attr("class", "channel_name").append("text").text(data[i].channel_name)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "input_text-" + data[i]).attr("class", "input_text").append("text").text(data[i].input_text)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "file_path-" + data[i]).attr("class", "file_path").append("text").text(data[i].file_path)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "file_type-" + data[i]).attr("class", "file_type").append("text").text(data[i].file_type)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "version-" + data[i]).attr("class", "version").append("text").text(data[i].version)
                  d3.select("#tbody").select("#tr-"+data[i].id).append("td").attr("id", "editDelete-" + data[i]).attr("class", "editDelete").append("text").text("Edit/Delete")
            }
        }
		</script>
