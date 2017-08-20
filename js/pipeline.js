	  
		function dragStart(event) {
			event.dataTransfer.setData("Text", event.target.id);
		}
		
		function dragging(event) {
			event.preventDefault();
		}
		
		function allowDrop(event) {
			event.preventDefault();
		}
		

		function drop() {
			var processDat = d3.event.dataTransfer.getData("Text");
			var posX = d3.event.x;
			var posY = d3.event.y;
						
			addProcess(processDat, posX, posY);
			// event.stopPropagation();
			return false;
		}
		
		function getValues(data) {
			var result = null;
			$.ajax({
				url:  "ajax/ajaxquery.php",
				data: data,
				async: false,
				cache: false,
				success: function(data) {
					result = data;
				}
			});
			return result;
		}
		
		var processData = getValues( {p: "getProcessData"} )
		addOption2Select()
		
		var savedData = getValues( {p: "getSavedPipelines"} )
		addOption2LoadSelect()
		
		var parametersData =  getValues( {p: "getParametersData" } )
		var sData = "";
		var svg = "";
		var mainG = "";
		function createSVG() {
			edges = []
			d3.select("svg").remove(); 
			svg = d3.select("#container").append("svg")
			.attr("id","svg")
			.attr("width", w)
			.attr("height", h)
			.on("mousedown", null)
			.on("mouseup", null)
			.call(zoom)
			mainG = d3.select("#container").select("svg").append("g")
			.attr("id","mainG")
			.attr("transform", "translate("+ 0 +","+ 0 +")")
		}
		
		function openPipeline() {
			createSVG()
			e = document.getElementById("pipelines");
			id = e.options[e.selectedIndex].id;
			sData = getValues( {p: "loadPipeline", id: id} )
			
			if (Object.keys(sData).length > 0) {
				nodes = sData[0].nodes
				nodes = JSON.parse(nodes.replace(/'/gi, "\""))
				mG = sData[0].mainG
				mG = JSON.parse(mG.replace(/'/gi, "\""))["mainG"]
				zoom.translate([parseFloat(mG[0]),parseFloat(mG[1])]).scale(parseFloat(mG[2]));
				newTransform = "translate("+ (parseFloat(mG[0])) +","+ (parseFloat(mG[1])) +")scale("+ (parseFloat(mG[2]))+")"
				d3.select("#mainG").attr("transform", newTransform)
				for (var key in nodes){
					x = nodes[key][0]
					y = nodes[key][1]
					pId = nodes[key][2]
					name = nodes[key][3]
					gN = key.split("-")[1]
					loadPipeline(x,y,pId,name,gN)
				}
				
				ed = sData[0].edges
				ed = JSON.parse(ed.replace(/'/gi, "\""))["edges"]
				for (var ee = 0; ee < ed.length; ee++) {
					eds = ed[ee].split("_")
					addCandidates2DictForLoad(eds[0])
					createEdges(eds[0],eds[1])
				}
			}
		}
		
		w = 1400
		h = 650
		r = 70
		cx = 0
		cy = 0
		ior = r/6
		var dat = [{x: 0, y: 0}]
		gNum = 0
		selectedgID = ""
		selectedg = ""
		diffx = 0
		diffy = 0
		
		processList = {}
		edges = []
		candidates = []
		saveNodes = []
		
		
		binding = false
		renameTextID  = ""
		deleteID = ""
		
		d3.select("#container")
			.style("background-image","url(http://68.media.tumblr.com/afc0c91aac9ccc5cbe10ff6f922f58dc/tumblr_nlzk53d4IQ1tagz2no6_r1_500.png)")
			.on("keydown",cancel)
			.on("mousedown", cancel)
			.on("drop", drop)
		

		var zoom = d3.behavior.zoom()
		.translate([0, 0])
		.scale(1)
		.scaleExtent([0.15, 2])
		.on("zoom", zoomed);
		
		createSVG()
		
		function zoomed(){
			mainG.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}
		
		function addOption2Select() {
			for (var i = 0; i < processData.length; i++) {
				d3.select("#mainProcesses").append("option")
				.attr("value",processData[i].name)
				.attr("id",processData[i].id)
				.text(processData[i].name)
				.attr("index",i)
			}
		}
		
		function addOption2LoadSelect() {
			for (var i = 0; i < savedData.length; i++) {
				d3.select("#pipelines").append("option")
				.attr("value",savedData[i].name)
				.attr("id",savedData[i].id)
				.text(savedData[i].name)
			}
		}
		
		function addProcess(processDat, xpos, ypos) {
			t = d3.transform(d3.select('#'+"mainG").attr("transform")),
			z = t.scale[0]
			
			var name = processDat.split('@')[0]
			var process_id = processDat.split('@')[1]
			var id = process_id
			
			var inputs =  getValues(  {p: "getInputs",
			"process_id": process_id} )
			var outputs = getValues(  {p: "getOutputs",
			"process_id": process_id} )

			console.log(d3.event.translate, d3.event.scale)
			
			//gnum uniqe, id same id (Written in class) in same type process
			g = d3.select("#mainG").append("g")
			.attr("id","g-" + gNum)
			.attr("class","g-"+id)
			// .attr("transform", "translate("+ (r+ior-(x/z) + 300) +","+ (r+ior-(y/z)) +")")
			.attr("transform", "translate("+ (0) +","+ (0) +")")
			.on("mouseover",mouseOverG)
			.on("mouseout",mouseOutG)
			//gnum(written in id): uniqe, id(Written in class): same id in same type process, bc(written in type): same at all bc
			g.append("circle").attr("id", "bc-" + gNum)
			.attr("class", "bc-" + id)
			.attr("type","bc")
			.attr("cx",cx)
			.attr("cy",cy)
			.attr("r",r+ior)
			.attr('fill-opacity', 0.6)
			.attr("fill", "red")
			.transition()
			.delay(500)
			.duration(3000)
			.attr("fill","#E0E0E0")
			//gnum(written in id): uniqe, id(Written in class): same id in same type process, sc(written in type): same at all bc
			g.append("circle")
			.datum([{cx: 0, cy: 0}])
			.attr("id", "sc-" + gNum )
			.attr("class", "sc-" + id)
			.attr("type","sc")
			.attr("r",r-ior)
			.attr("fill","#BEBEBE")
			.attr('fill-opacity', 0.6)
			.on("mouseover",scMouseOver)
			.on("mouseout",scMouseOut)
			.call(drag)
			//gnum(written in id): uniqe,
			g.append("text").attr("id", "text-" + gNum )
			.datum([{cx: 0, cy: 0}])
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '1em')
			.text(name)
			.style("text-anchor","middle")
			.on("mouseover",scMouseOver)
			.on("mouseout",scMouseOut)
			.call(drag)
			
			g.append("text").attr("id", "text-" + gNum )
			.datum([{cx: 0, cy: 0}])
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '0.9em')
			.attr("x", -6)
			.attr("y", 15)
			.text('\uf040')
			.on("mousedown",rename)
			
			//gnum(written in id): uniqe,
			g.append("text")
			.attr("id","del-"+gNum)
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '1em')
			.attr("x", -6)
			.attr("y", r+ ior/2)
			.text('\uf014')
			.style("opacity",0.2)
			.on("mousedown", removeElement)
			
			g.append("text")
			.attr("id","info-"+gNum)
			.attr("class", "info-"+id)			
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '1em')
			.attr("x", 0)
			.attr("y", -1*( r + ior/2 - 10))
			.text('\uf129')
			.style("opacity",0.2)
			.on("mousedown", getInfo)
			
			// I/O id naming:[0]i = input,o = output -[1]process database ID -[2]The number of I/O of the selected process -[3]Parameter database ID- [4]uniqe number
			for (var k = 0; k < inputs.length; k++) {
				d3.select("#g-"+gNum).append("circle")
				.attr("id","i-"+(id)+"-"+k+"-"+inputs[k].parameter_id+"-"+gNum)
				.attr("type", "I/O")
				.attr("kind","input")
				.attr("parentG","g-"+gNum)
				.attr("name", inputs[k].name)
				.attr("status","standard" )
				.attr("class",findType(inputs[k].parameter_id) + " input")
				.attr("cx",calculatePos(inputs.length,k,"cx","inputs"))
				.attr("cy",calculatePos(inputs.length,k,"cy","inputs"))
				.attr("r", ior)
				.attr("fill","tomato")
				.attr('fill-opacity', 0.8)
				.on("mouseover", IOmouseOver)
				.on("mousemove", IOmouseMove)
				.on("mouseout", IOmouseOut)
				.on("mousedown",IOconnect)
			}
			for (var k = 0; k < outputs.length; k++) {
				d3.select("#g-"+gNum).append("circle")
				.attr("id","o-"+(id)+"-"+k+"-"+outputs[k].parameter_id+"-"+gNum)
				.attr("type", "I/O")
				.attr("kind","output")
				.attr("parentG","g-"+gNum)
				.attr("name", outputs[k].name)
				.attr("status","standard")
				.attr("class",findType(outputs[k].parameter_id) +" output")
				.attr("cx",calculatePos(outputs.length,k,"cx","outputs"))
				.attr("cy",calculatePos(outputs.length,k,"cy","outputs"))
				.attr("r", ior).attr("fill","steelblue")
				.attr('fill-opacity', 0.8 )
				.on("mouseover", IOmouseOver)
				.on("mousemove", IOmouseMove)
				.on("mouseout", IOmouseOut)
				.on("mousedown",IOconnect)
			}
			processList[("g-"+gNum)] = name
			gNum = gNum + 1
		}
		
		function findType(id) {
			parameter = parametersData.filter(function (el) {return el.id == id})
			return parameter[0].file_type
		}
		function calculatePos(len,k,poz,type){
			degree = (180/(len+1))*(k+1)
			
			inp = (270-(180/(len+1))*(k+1)) * Math.PI/180
			out = (270-(-180/(len+1))*(k+1)) * Math.PI/180
			
			if (type == "inputs") {
				if (poz == "cx") {
					calc = Math.cos(inp)
					result = (calc*r)
				}else {
					calc =Math.sin(inp)
					result = (calc*r)
				}
			} else {
				if (poz == "cx") {
					calc = Math.cos(out)
					result = (calc*r)
				} else {
					calc =Math.sin(out)
					result = (calc*r)
				}
			}
			return result;
		}
		
		function mouseOverG() {
			d3.select("#container").on("mousedown",null)
			if(!binding){
				d3.select("#del-"+this.id.split("-")[1]).style("opacity",1)
				d3.select("#info-"+this.id.split("-")[1]).style("opacity",1)
			}
		}
		
		function mouseOutG() {
			d3.select("#container").on("mousedown",cancel)
			d3.select("#del-"+this.id.split("-")[1]).style("opacity",0.2)
			d3.select("#info-"+this.id.split("-")[1]).style("opacity",0.2)
			
		}
		
		var drag = d3.behavior.drag()
		.origin(function(d) { return d; })
		.on("dragstart", dragstarted)
		.on("drag", dragged)
		.on("dragend", dragended);
		
		
		function dragstarted(d) {
			selectedg = document.getElementById(this.id).parentElement
			coor = d3.mouse(this)
			diffx = 0-coor[0]
			diffy = 0-coor[1]
			d3.event.sourceEvent.stopPropagation();
			d3.select(document.getElementById(this.id).parentElement).classed("dragging", true);
		}
		
		function dragged(d) {
			if (!binding) {
				coor = d3.mouse(this)
				t = d3.transform(d3.select('#'+document.getElementById(this.id).parentElement.id).attr("transform")),
				x = t.translate[0]
				y = t.translate[1]
				console.log("x:" + x + " y:" + y)
				d3.select(selectedg).attr("transform", "translate("+(x+coor[0]+diffx)+ ","+(y+coor[1]+diffy)+")")
				moveLine(selectedg.id,x,y,coor)
			}
		}
		
		function dragended(d) {
			d3.select(selectedg).classed("dragging", false);
		}
		
		function moveLine(gId,x,y,coor) {
			allLines = d3.selectAll("line")[0]
			for (var line = 0; line < allLines.length; line++) {
				from = allLines[line].getAttribute("g_from")
				to = allLines[line].getAttribute("g_to")
				
				if (from == gId) {
					lineid = allLines[line].id
					IOid = lineid.split("_")[0]
					IOx = d3.select("#" + IOid)[0][0].cx.baseVal.value
					IOy = d3.select("#" + IOid)[0][0].cy.baseVal.value
					d3.select("#" + lineid).attr("x1",coor[0] + diffx + IOx +x).attr("y1", coor[1]+diffy+IOy+y)
					moveDelCircle(lineid)
				}
				else if (to == gId) {
					lineid = allLines[line].id
					IOid = lineid.split("_")[1]
					IOx = d3.select("#" + IOid)[0][0].cx.baseVal.value
					IOy = d3.select("#" + IOid)[0][0].cy.baseVal.value
					d3.select("#" + lineid).attr("x2", coor[0] + diffx + IOx +x).attr("y2", coor[1]+diffy+IOy+y)
					moveDelCircle(lineid)
				}
			}
		}
		
		function moveDelCircle(lineid) {
			x1 = d3.select("#"+lineid)[0][0].x1.baseVal.value
			x2 = d3.select("#"+lineid)[0][0].x2.baseVal.value
			y1 = d3.select("#"+lineid)[0][0].y1.baseVal.value
			y2 = d3.select("#"+lineid)[0][0].y2.baseVal.value
			d3.select("#c--" +lineid).attr("cx",(x1+x2)/2).attr("cy",(y1+y2)/2)
			d3.select("#c--" +lineid).attr("transform", "translate("+ ((x1+x2)/2)+ ","+((y1+y2)/2)+")")
		}
		
		function scMouseOver() {
			parent = document.getElementById(this.id).parentElement.id;
			if (this.id.split("-")[0] == "text") {
				cid = "sc-" + this.id.split("-")[1]
			}
			else {
				cid = this.id
			}
			d3.select("#"+cid).attr("fill","gray")
			if (!binding) {
				d3.selectAll("line").attr("status","hide")
				d3.selectAll("line[g_from ="+ parent +"]").attr("status","standard")
				d3.selectAll("line[g_to ="+parent+"]").attr("status","standard")
			}
			showEdges()
		}
		
		function scMouseOut() {
			if (this.id.split("-")[0] == "text") {
				cid = "sc-" + this.id.split("-")[1]
			}
			else {
				cid = this.id
			}
			d3.select("#"+cid).attr("fill","#BEBEBE")
			if (!binding) {
				d3.selectAll("line").attr("status","standard")
			}
			showEdges()
		}
		
		function remove() {
			if (!binding){
				g = document.getElementById(deleteID).parentElement.id
				d3.select("#" + g).remove()
				delete processList[g]
				removeLines(g)
				cancelRemove()
			}
		}
		
		function removeLines(g) {
			allLines = d3.selectAll("line")[0]
			for (var line = 0; line < allLines.length; line++) {
				from = allLines[line].getAttribute("g_from")
				to = allLines[line].getAttribute("g_to")
				
				if (from == g || to == g) {
					lineid = allLines[line].id
					d3.select("#" + lineid).remove()
					edges.splice (edges.indexOf("lineid"), 1);
					removeDelCircle(lineid)
				}
			}
		}
		
		function removeDelCircle(lineid) {
			d3.select("#c--" + lineid).remove()
		}
		var tooltip = d3.select("body")
		.append("div").attr("class", "tooltip-inner")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("Something");
		
		function IOmouseOver() {
			if (binding) {
				if (d3.select("#"+this.id).attr("status") == "candidate") {
					d3.select("#"+this.id).attr("status","posCandidate")
					showOptions()
				}
			}
			else {
				className = document.getElementById(this.id).className.baseVal.split(" ")
				cand = searchedType(className[1])
				parentg = d3.select("#" + this.id).attr("parentG")
				
				d3.selectAll("circle[type ='I/O']").attr("status","noncandidate")
				d3.selectAll("."+className[0]).filter("." + cand).attr("status","candidate")
				d3.selectAll("circle[parentG ="+parentg+"]").attr("status","noncandidate")
				d3.selectAll("#"+this.id).attr("status","mouseon")
				
				
				tooltip.text(className[0])
				tooltip.style("visibility", "visible");
				
				d3.selectAll("line").attr("status","hide")
				d3.selectAll("line[IO_from ="+ this.id +"]").attr("status","standard")
				d3.selectAll("line[IO_to ="+this.id+"]").attr("status","standard")
				
				showOptions()
				showEdges()
			}
		}
		function IOmouseMove() {
			tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		}
		
		function IOmouseOut() {
			if (binding) {
				if (d3.select("#"+this.id).attr("status") == "posCandidate") {
					d3.select("#"+this.id).attr("status","candidate")
					showOptions()
				}
				
			}
			else {
				d3.selectAll("circle[type ='I/O']").attr("status","standard")
				d3.selectAll("line").attr("status","standard")
				showOptions()
				showEdges()
			}
			tooltip.style("visibility", "hidden");
			
		}
		
		function IOconnect() {
			selectedIO = this.id
			className = document.getElementById(selectedIO).className.baseVal.split(" ")
			cand = searchedType(className[1])
			
			if (binding) {
				stopBinding(className,cand,selectedIO)
			}
			
			else {
				startBinding(className,cand,selectedIO)
			}
		}
		
		function startBinding(clasNames,cand,selectedIO) {
			parentg = d3.select("#" + selectedIO).attr("parentG")
			
			d3.selectAll("circle[type ='I/O']").attr("status","noncandidate")
			d3.selectAll("."+className[0]).filter("." + cand).attr("status","candidate")
			d3.selectAll("circle[parentG ="+parentg+"]").attr("status","noncandidate")
			d3.selectAll("#"+selectedIO).attr("status","selected")
			d3.selectAll("line").attr("status","hide")
			d3.select("#del-"+selectedIO.split("-")[4]).style("opacity",0.2)
			
			for (var edge = 0; edge < edges.length; edge++) {
				if (edges[edge].indexOf(selectedIO) > -1){
					d3.select("#"+findEdges(edges[edge],selectedIO)).attr("status","noncandidate")
				}
			}
			addCandidates2Dict()
			binding = true
			showOptions()
			showEdges()
		}
		
		function stopBinding() {
			firstid = d3.select("circle[status ='selected']")[0][0].id
			d3.selectAll("line").attr("status","standard")
			if (selectedIO == firstid) {
				firstid = d3.select("#"+firstid).attr("status","mouseon")
				d3.selectAll("."+className[0]).filter("." + cand).attr("status","candidate")
				d3.select("#del-"+selectedIO.split("-")[4]).style("opacity",1)
			}
			else {
				secondid = d3.select("circle[status ='posCandidate']")[0][0].id
				createEdges(firstid,secondid)
				d3.selectAll("circle[type ='I/O']").attr("status","standard")
				d3.select("#del-"+secondid.split("-")[4]).style("opacity",1)
			}
			binding = false
			showOptions()
			showEdges()
		}
		
		function showOptions() {
			d3.selectAll("circle[status ='standard']").attr("r", ior).style("stroke", "").style("stroke-width", "").style("stroke-opacity", "")
			d3.selectAll("circle[status ='mouseon']").attr("r", ior*1.4).style("stroke", "#ff9999").style("stroke-width", 4).style("stroke-opacity", .5)
			d3.selectAll("circle[status ='selected']").attr("r", ior*1.4).style("stroke", "#ff0000").style("stroke-width", 4).style("stroke-opacity", .5)
			d3.selectAll("circle[status ='noncandidate']").attr("r", ior*0.5).style("stroke", "")
			d3.selectAll("circle[status ='candidate']").attr("r", ior*1.4).style("stroke", "#ccff66").style("stroke-width", 4).style("stroke-opacity", .5)
			d3.selectAll("circle[status ='posCandidate']").attr("r", ior*1.4).style("stroke", "#ff9999").style("stroke-width", 4).style("stroke-opacity", .5)
		}
		var link = d3.svg.diagonal()
		.projection(function(d)
		{
			return [d.y, d.x];
		});
		function showEdges(){
			d3.selectAll("line[status = 'standard']").style("stroke", "#B0B0B0").style("stroke-width", 4).attr("opacity",1);
			d3.selectAll("line[status = 'hide']").style("stroke-width", 2).attr("opacity",0.3)
		}
		
		function searchedType(type) {
			if (type == "input") {
				return "output"
			}
			else{
				return "input"
			}
		}
		
		function findEdges(edge,selectedIO) {
			edgeNodes = edge.split("_")
			if (edgeNodes[0] == selectedIO) {
				return edgeNodes[1]
			}
			else {
				return edgeNodes[0]
			}
		}
		
		function addCandidates2Dict() {
			candidates = []
			candList = d3.selectAll(("circle[status ='candidate']"))[0]
			sel = d3.selectAll(("circle[status ='selected']"))[0][0]
			candList.push(sel)
			
			for (var c = 0; c < candList.length; c++) {
				currid = candList[c].id
				gid = document.getElementById(currid).parentElement.id;
				
				t = d3.transform(d3.select('#'+gid).attr("transform")),
				x = t.translate[0]
				y = t.translate[1]
				
				circx = candList[c].cx.baseVal.value + x
				circy = candList[c].cy.baseVal.value + y
				
				posList = [circx,circy,gid]
				candidates[currid] = posList
			}
		}
		
		
		function createEdges(first,second) {
			d3.select("#mainG").append("line")
			.attr("id",first +"_"+ second)
			.attr("class","line")
			.attr("type","standard")
			.style("stroke", "#B0B0B0").style("stroke-width", 4)
			.attr("x1", candidates[first][0])
			.attr("y1", candidates[first][1])
			.attr("x2", candidates[second][0])
			.attr("y2", candidates[second][1])
			.attr("g_from",candidates[first][2])
			.attr("g_to",candidates[second][2])
			.attr("IO_from",first)
			.attr("IO_to",second)
			.attr("stroke-width", 2)
			.attr("stroke", "black")
			
			d3.select("#mainG").append("g")
			.attr("id","c--"+first +"_"+ second)
			.attr("transform", "translate("+ (candidates[first][0]+candidates[second][0])/2 +","+ (candidates[first][1]+candidates[second][1])/2 +")")
			.attr("g_from",candidates[first][2])
			.attr("g_to",candidates[second][2])
			.attr("IO_from",first)
			.attr("IO_to",second)
			.on("mousedown",removeElement)
			.on("mouseover",delMouseOver)
			.on("mouseout",delMouseOut)
			.append("circle")
			.attr("id","delc--"+first +"_"+ second)
			.attr("class","del")
			.attr("cx",0)
			.attr("cy",0)
			.attr("r",ior)
			.attr("fill","#E0E0E0")
			.attr('fill-opacity', 0.4)
			
			d3.select("#c--"+first +"_"+ second)
			.append("text")
			.attr("id","del--"+first +"_"+ second)
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '1em')
			.attr("x", -5)
			.attr("y", 5)
			.text('\uf014')
			.style("opacity",0.4)
			
			edges.push(first +"_"+ second)
		}
		
		function removeEdge() {
			d3.select("#" + deleteID).remove()
			d3.select("#"+deleteID.split("--")[1]).remove()
			edges.splice(edges.indexOf(deleteID.split("--")[1]), 1);
			cancelRemove()
		}
		
		function delMouseOver() {
			d3.select("#del"+this.id).attr('fill-opacity', 0.8)
			d3.select("#del--"+this.id.split("--")[1]).style("opacity",0.8)
		}
		
		function delMouseOut() {
			d3.select("#del"+this.id).attr('fill-opacity', 0.4)
			d3.select("#del--"+this.id.split("--")[1]).style("opacity",0.4)
		}
		
		function cancel() {
			if (binding) {
				d3.selectAll("circle[type ='I/O']").attr("status","standard")
				binding = false
				showOptions()
			}
		}
		
		function rename() {
			renameTextID = this.id
			text = d3.select("#" + this.id).text()
			body = document.body
			bodyW = body.offsetWidth
			bodyH = body.scrollHeight
			
			d3.select("#container").append('div')
			.attr('id', 'rename')
			.style('position','absolute')
			.style('top', 0)
			.style('left',0)
			.style("width", bodyW +"px")
			.style("height", bodyH +"px")
			.style("background-color","gray")
			.style("opacity",0.8)
			.on("mousedown",cancelRename)
			
			d3.select("#container").append('div')
			.attr('id', 'renameContainer')
			.style('position','absolute')
			.style('top', 100  +"px")
			.style('left',300  +"px")
			.style("width", "500px")
			.style("height","200px")
			.style("background-color","white")
			.style("opacity",1)
			
			d3.select("#renameContainer").append("div")
			.attr("id","renameInputContainer")
			.attr("class","col-md-12")
			.append("div")
			.attr("class","col-md-3")
			
			d3.select("#renameInputContainer").append("div")
			.attr("class","col-md-6")
			.append("input")
			.attr("id","renameInput")
			.attr("class","form-control")
			.attr("value",text)
			.style("margin-top", "40px")
			.on('keyup', function (e) {if (event.keyCode == 13) {changeName()} });
			
			d3.select("#renameInputContainer").append("div")
			.attr("id","renameButtonContainer")
			.attr("class","col-md-12")
			.append("div")
			.attr("class","col-md-6")
			.append("button")
			.attr("class","form-control btn-info")
			.attr("onclick","cancelRename()")
			.style("margin-top", "40px")
			.text("Cancel")
			
			d3.select("#renameButtonContainer")
			.append("div")
			.attr("class","col-md-6")
			.append("button")
			.attr("class","form-control btn-success")
			.attr("onclick","changeName()")
			.style("margin-top", "40px")
			.text("Submit")
		}
		
		function changeName() {
			newName = document.getElementById("renameInput").value
			d3.select("#" + renameTextID).text(newName)
			document.getElementById(renameTextID).parentElement.id
			processList[document.getElementById(renameTextID).parentElement.id] = newName
			cancelRename()
		}
		
		
		function getInfo() {
			className = document.getElementById(this.id).className.baseVal.split("-")
			infoID = className[1]
			console.log(infoID)
			document.getElementById('id01').style.display='block'
			inputTable = getInputTable(infoID)
			outputTable = getOutputTable(infoID)
			var processInfo= getValues(  {p: "getProcessData",
			"process_id": infoID} )
			console.log(processInfo)
			document.getElementById("process_name").innerHTML = processInfo[0].name
			document.getElementById("process_summary").innerHTML = processInfo[0].summary
			document.getElementById("process_script").innerHTML = "<pre><code>" + processInfo[0].script + "</code></pre>"
		}
		
		function removeElement() {
			deleteID = this.id
			body = document.body
			bodyW = body.offsetWidth
			bodyH = body.offsetHeight
			
			if (!binding) {
				d3.select("#container").append('div')
				.attr('id', 'removeElement')
				.style('position','absolute')
				.style('top', 0)
				.style('left',0)
				.style("width", bodyW +"px")
				.style("height", bodyH +"px")
				.style("background-color","gray")
				.style("opacity",0.8)
				.on("mousedown",cancelRemove)
				
				d3.select("#container").append('div')
				.attr('id', 'removeElementCont')
				.style('position','absolute')
				.style('top', 100  +"px")
				.style('left',300  +"px")
				.style("width", "500px")
				.style("height","200px")
				.style("background-color","white")
				.style("opacity",1)
				
				d3.select("#removeElementCont").append("div")
				.attr("id","removeTextCont")
				.attr("class","col-md-12")
				.append("div")
				.attr("class","col-md-3")
				
				d3.select("#removeTextCont").append("div")
				.attr("class","col-md-6")
				.style("margin-top", "40px")
				.style("text-align","center")
				.append("text")
				.attr("id","warning")
				.text("Are you sure you want to delete?")
				
				d3.select("#removeTextCont").append("div")
				.attr("id","removeButtonContainer")
				.attr("class","col-md-12")
				.append("div")
				.attr("class","col-md-6")
				.append("button")
				.attr("class","form-control btn-info")
				.attr("onclick","cancelRemove()")
				.style("margin-top", "40px")
				.text("No")
				
				if (deleteID.split("_").length == 2) {
					d3.select("#removeButtonContainer")
					.append("div")
					.attr("class","col-md-6")
					.append("button")
					.attr("class","form-control btn-success")
					.attr("onclick","removeEdge()")
					.style("margin-top", "40px")
					.text("Yes")
				}
				else if (deleteID.split("_").length == 1) {
					d3.select("#removeButtonContainer")
					.append("div")
					.attr("class","col-md-6")
					.append("button")
					.attr("class","form-control btn-success")
					.attr("onclick","remove()")
					.style("margin-top", "40px")
					.text("Yes")
				}
			}
		}
		
		function cancelRemove(){
			d3.select("#removeElement").remove()
			d3.select("#removeElementCont").remove()
			
		}
		
		function cancelRename() {
			d3.select("#renameContainer").remove()
			d3.select("#rename").remove()
			
		}
		
		function createNextflowFile() {
			text = ""
			for (var key in processList) {
				className = document.getElementById(key).getAttribute("class");
				mainProcessId = className.split("-")[1]
				IOandScriptForNf(mainProcessId,key)
				
				proText = "process " + processList[key] + " {\n\n" + IOandScriptForNf(mainProcessId,key) +"\n\n}" + "\n\n"
				text = text + proText
			}
			
			return text
		}
		
		
		function IOandScriptForNf(id,currgid) {
			var processData = getValues(  {p: "getProcessData",
			"process_id": id} )
			script = processData[0].script
			
			bodyInput = ""
			bodyOutput = ""
			IList = d3.select("#"+currgid).selectAll("circle[kind ='input']")[0]
			OList = d3.select("#"+currgid).selectAll("circle[kind ='output']")[0]
			for (var i = 0; i < IList.length; i++) {
				if (bodyInput == "") {
					bodyInput = "input:\n"
				}
				Iid = IList[i].id
				inputIdSplit = Iid.split("-")
				qual = parametersData.filter(function (el) {return el.id == inputIdSplit[3]})[0].qualifier
				inputName = document.getElementById(Iid).getAttribute("name")
				find = false
				for (var e = 0; e < edges.length; e++) {
					if (edges[e].indexOf(Iid) > -1) {
						find = true
						nodes = edges[e].split("_")
						if (nodes[0][0] == o) {
							channelName = document.getElementById(nodes[1]).getAttribute("parentG")
						}
						else {
							channelName = document.getElementById(nodes[0]).getAttribute("parentG")
						}
						bodyInput = bodyInput +" "+ qual +" "+inputName + " from " + channelName + "\n"
					}
				}
				if (find == false) {
					bodyInput = bodyInput +" "+ qual +" "+inputName + " from " + "param" + "\n"
				}
			}
			
			for (var o = 0; o < OList.length; o++) {
				if (bodyOutput == "") {
					bodyOutput = "output:\n"
				}
				Oid = OList[o].id
				outputIdSplit = Oid.split("-")
				qual = parametersData.filter(function (el) {return el.id == outputIdSplit[3]})[0].qualifier
				outputName = document.getElementById(Oid).getAttribute("name")
				channelName = document.getElementById(Oid).getAttribute("parentG")
				
				bodyOutput = bodyOutput + " " + qual + " " + outputName + " into " + channelName + "\n"
			}
			body = bodyInput +"\n"+ bodyOutput +"\n"+ "\"\"\"" + script + "\"\"\""
			return body
		}
		
		function download(filename,text) {
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
			element.setAttribute('download', filename);
			
			element.style.display = 'none';
			document.body.appendChild(element);
			
			element.click();
			
			document.body.removeChild(element);
		}
		
		function resetPos() {
			d3.select("#mainG").attr("transform","translate(0,0)scale(1)")
		}
		
		function save(){
			saveNodes = {}
			saveMainG = {}
			for (var key in processList) {
				t = d3.transform(d3.select('#'+key).attr("transform")),
				x = t.translate[0]
				y = t.translate[1]
				gClass = document.getElementById(key).className.baseVal
				prosessID = gClass.split("-")[1]
				processName = processList[key]
				saveNodes[key] = [x,y,prosessID,processName]
			}
			Maint = d3.transform(d3.select('#'+"mainG").attr("transform")),
			Mainx = Maint.translate[0]
			Mainy = Maint.translate[1]
			Mainz = Maint.scale[0]
			sName = document.getElementById("saveNameInput").value
			id = 0
			if (document.getElementById("saveNameInput").value == "") {
				e = document.getElementById("pipelines");
				id = e.options[e.selectedIndex].id;
			}
			
			
			
			saveMainG["mainG"] = [Mainx,Mainy,Mainz]
			savedList = [{"name":sName}, {"id":id}, {"nodes":saveNodes}, saveMainG, {"edges": edges}]
			sl = JSON.stringify(savedList)
			var ret = getValues({p: "saveAllPipeline", dat: sl})
			if (ret.id > 0) {                
				d3.select("#pipelines").append("option")
				.attr("value",sName)
				.attr("id", ret.id)
				.text(sName)
			}
		}
		
		function loadPipeline(sDataX,sDataY,sDatapId,sDataName,gN) {
			t = d3.transform(d3.select('#'+"mainG").attr("transform")),
			x = t.translate[0]
			y = t.translate[1]
			z = t.scale[0]
			
			gNum = parseInt(gN)
			e = document.getElementById("mainProcesses");
			name = sDataName
			id = sDatapId
			index = e.options[e.selectedIndex].index;
			inputs =  getValues(  {p: "getInputs",
			"process_id": id} )
			outputs = getValues(  {p: "getOutputs",
			"process_id": id} )
			
			//gnum uniqe, id same id (Written in class) in same type process
			g = d3.select("#mainG").append("g")
			.attr("id","g-" + gNum)
			.attr("class","g-"+id)
			.attr("transform", "translate("+ (sDataX) +","+ (sDataY) +")")
			.on("mouseover",mouseOverG)
			.on("mouseout",mouseOutG)
			//gnum(written in id): uniqe, id(Written in class): same id in same type process, bc(written in type): same at all bc
			g.append("circle").attr("id", "bc-" + gNum )
			.attr("class", "bc-" + id)
			.attr("type","bc")
			.attr("cx",cx)
			.attr("cy",cy)
			.attr("r",r+ior)
			.attr('fill-opacity', 0.6)
			.attr("fill", "red")
			.transition()
			.delay(500)
			.duration(3000)
			.attr("fill","#E0E0E0")
			//gnum(written in id): uniqe, id(Written in class): same id in same type process, sc(written in type): same at all bc
			g.append("circle")
			.datum([{cx: 0, cy: 0}])
			.attr("id", "sc-" + gNum )
			.attr("class", "sc-" + id)
			.attr("type","sc")
			.attr("r",r-ior)
			.attr("fill","#BEBEBE")
			.attr('fill-opacity', 0.6)
			.on("mouseover",scMouseOver)
			.on("mouseout",scMouseOut)
			.call(drag)
			//gnum(written in id): uniqe,
			g.append("text").attr("id", "text-" + gNum )
			.datum([{cx: 0, cy: 0}])
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '1em')
			.text(name)
			.style("text-anchor","middle")
			.on("mouseover",scMouseOver)
			.on("mouseout",scMouseOut)
			.call(drag)
			
			g.append("text").attr("id", "text-" + gNum )
			.datum([{cx: 0, cy: 0}])
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '0.9em')
			.attr("x", -6)
			.attr("y", 15)
			.text('\uf040')
			.on("mousedown",rename)
			//gnum(written in id): uniqe,
			g.append("text")
			.attr("id","del-"+gNum)
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '1em')
			.attr("x", -6)
			.attr("y", r+ ior/2)
			.text('\uf014')
			.style("opacity",0.2)
			.on("mousedown", removeElement)
			
			g.append("text")
			.attr("id","info-"+gNum)
			.attr("class", "info-"+id)
			.attr('font-family', 'FontAwesome')
			.attr('font-size', '1em')
			.attr("x", 0)
			.attr("y", -1*( r + ior/2 - 10))
			.text('\uf129')
			.style("opacity",0.2)
			.on("mousedown", getInfo)
			// I/O id naming:[0]i = input,o = output -[1]process database ID -[2]The number of I/O of the selected process -[3]Parameter database ID- [4]uniqe number
			for (var k = 0; k < inputs.length; k++) {
				d3.select("#g-"+gNum).append("circle")
				.attr("id","i-"+(id)+"-"+k+"-"+inputs[k].parameter_id+"-"+gNum)
				.attr("type", "I/O")
				.attr("kind","input")
				.attr("parentG","g-"+gNum)
				.attr("name", inputs[k].name)
				.attr("status","standard" )
				.attr("class",findType(inputs[k].parameter_id) + " input")
				.attr("cx",calculatePos(inputs.length,k,"cx","inputs"))
				.attr("cy",calculatePos(inputs.length,k,"cy","inputs"))
				.attr("r", ior)
				.attr("fill","tomato")
				.attr('fill-opacity', 0.8)
				.on("mouseover", IOmouseOver)
				.on("mousemove", IOmouseMove)
				.on("mouseout", IOmouseOut)
				.on("mousedown",IOconnect)
			}
			
			for (var k = 0; k < outputs.length; k++) {
				d3.select("#g-"+gNum).append("circle")
				.attr("id","o-"+(id)+"-"+k+"-"+outputs[k].parameter_id+"-"+gNum)
				.attr("type", "I/O")
				.attr("kind","output")
				.attr("parentG","g-"+gNum)
				.attr("name", outputs[k].name)
				.attr("status","standard")
				.attr("class", findType(outputs[k].parameter_id) +" output")
				.attr("cx",calculatePos(outputs.length,k,"cx","outputs"))
				.attr("cy",calculatePos(outputs.length,k,"cy","outputs"))
				.attr("r", ior).attr("fill","steelblue")
				.attr('fill-opacity', 0.8 )
				.on("mouseover", IOmouseOver)
				.on("mousemove", IOmouseMove)
				.on("mouseout", IOmouseOut)
				.on("mousedown",IOconnect)
			}
			processList[("g-"+gNum)] = name
			gNum = gNum + 1
			
		}
		
		function addCandidates2DictForLoad(fir) {
			candidates = []
			candList = d3.selectAll(("circle[type ='I/O']"))[0]
			sel = d3.select(("#"+fir))[0][0]
			candList.push(sel)
			for (var c = 0; c < candList.length; c++) {
				currid = candList[c].id
				gid = document.getElementById(currid).parentElement.id;
				
				t = d3.transform(d3.select('#'+gid).attr("transform")),
				x = t.translate[0]
				y = t.translate[1]
				
				circx = candList[c].cx.baseVal.value + x
				circy = candList[c].cy.baseVal.value + y
				
				posList = [circx,circy,gid]
				candidates[currid] = posList
			}
		}
		
		function saveReady() {
			document.getElementById("saveButton").disabled = false;
		}
		document.getElementsByClassName("tablink")[0].click();
		
		function openPage(evt, name) {
			var i, x, tablinks;
			x = document.getElementsByClassName("nodisp");
			for (i = 0; i < x.length; i++) {
				x[i].style.display = "none";
			}
			tablinks = document.getElementsByClassName("tablink");
			for (i = 0; i < x.length; i++) {
				tablinks[i].classList.remove("w3-light-grey");
			}
			document.getElementById(name).style.display = "block";
			evt.currentTarget.classList.add("w3-light-grey");
		}
		