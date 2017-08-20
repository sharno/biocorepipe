
const r = 30;
let availableProcesses = [];
let availableParameters = [
    {
        parameter_id: 1,
        parameter_name: "test input",
    },
];

const defaultX = 400;
const defaultY = 200;

const xScale = d3.scaleBand();

$("#add-process-btn").click(function() {
    $('#add-new-process-modal').modal();
});

$("#add-parameter-btn").click(function() {
    $('#add-new-parameter-modal').modal();
});

$("#add-selected-process-btn").click(function() {
    $('#add-new-process-modal').modal();
});




$("#save-btn-new-process").click(function () {
    saveAndDismissNewProcessModal();
});

$("#save-btn-new-parameter").click(function () {
    saveAndDismissNewParameterModal();
});


const margin = {top: -5, right: -5, bottom: -5, left: -5};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// const zoom = d3.zoom()
//     .scaleExtent([1, 10])
//     .on("zoom", zoomed);

const drag = d3.drag()
.subject(function(d) { return d; })
.on("drag", dragged);

const svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.right + ")");
// .call(zoom);

const rect = svg.append("rect")
.attr("width", width)
.attr("height", height)
.style("fill", "none")
.style("pointer-events", "all");

const container = svg.append("g");


// axes for showing the boxes in background
container.append("g")
.attr("class", "x axis")
.selectAll("line")
.data(d3.range(0, width, 10))
.enter().append("line")
.attr("x1", function(d) { return d; })
.attr("y1", 0)
.attr("x2", function(d) { return d; })
.attr("y2", height);

container.append("g")
.attr("class", "y axis")
.selectAll("line")
.data(d3.range(0, height, 10))
.enter().append("line")
.attr("x1", 0)
.attr("y1", function(d) { return d; })
.attr("x2", width)
.attr("y2", function(d) { return d; });

saveAndDismissNewProcessModal()




// drawing  the data
function drawNewProcess(newProcess){
    const process = container.selectAll(".process")
    .data([newProcess], d => d.process_id)
    .enter()
    .append("g")
    .attr("class", "process")
    .attr("transform", d => "translate(" + (d.x || defaultX) + "," + (d.y || defaultY) + ")")
    .call(drag);
    
    process.append("circle")
    .attr("r", r);
    
    process.append("text")
    .text(d => d.process_name)
    .classed("process-name", true)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle");
    
    // EDIT btn
    process.append("text")
    .text("Edit")
    .classed("edit-text", true)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "text-before-edge")
    .attr("y", r)
    .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
    })
    .on("mouseout", function(d) {
        d3.select(this).style("cursor", "default");
    })
    .on("click", function (d, i) {
        
    });
    
    // ADD INPUT btn
    process.append("text")
    .text("Add input |")
    .classed("edit-text", true)
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "text-after-edge")
    .attr("y", -r)
    .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
    })
    .on("mouseout", function(d) {
        d3.select(this).style("cursor", "default");
    })
    .on("click", function (d, i) {
        let inputBox = d3.select(this.parentNode)
        .append("g")
        .attr("id", "input-selection")
        .attr("transform", "translate("+ (-7*r) +","+ (-2.5*r) +")");
        
        inputBox.append("rect")
        // .attr("x", -7*r)
        // .attr("y", -2.5*r)
        .attr("width", 4*r)
        .attr("height", availableParameters.length * 30)
        .style("fill", "yellow")
        
        inputBox.selectAll(".inputs")
        .data(availableParameters, d => d.parameter_id)
        .enter()
        .append("text")
        .text(d => d.parameter_name)
        .attr("x", 10)
        .attr("y", (d, i) => i*30 + 20)
        .style("fill", "black")
        .style("font-size", 20)
        .on("mouseover", function(d) {
            d3.select(this).style("cursor", "pointer");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("cursor", "default");
        })
        .on("click", function(d) {
            const process_data = d3.select(this.parentNode.parentNode).datum();
            process_data.process_input.push(d);
            
            for (p of availableProcesses){
                if (p.process_output.some(o => o.parameter_id === d.parameter_id) && p.process_id !== process_data.process_id) {
                    
                    let line = container.append("line")
                    .classed("links", true)
                    .attr("x1", p.x)
                    .attr("y1", p.y)
                    .attr("x2", process_data.x)
                    .attr("y2", process_data.y)
                    .style("stroke", "black")
                    p.lines.push(line);
                    process_data.lines.push(line);

                }
            }
            
            d3.select("#input-selection").remove();
        });
    });
    
    // ADD OUTPUT btn
    process.append("text")
    .text("| Add output")
    .classed("edit-text", true)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "text-after-edge")
    .attr("y", -r)
    .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
    })
    .on("mouseout", function(d) {
        d3.select(this).style("cursor", "default");
    })
    .on("click", function (d, i) {
        let outputBox = d3.select(this.parentNode)
        .append("g")
        .attr("id", "output-selection")
        .attr("transform", "translate("+ (3*r) +","+ (-2.5*r) +")");
        
        outputBox.append("rect")
        // .attr("x", -7*r)
        // .attr("y", -2.5*r)
        .attr("width", 4*r)
        .attr("height", availableParameters.length * 30)
        .style("fill", "yellow")
        
        outputBox.selectAll(".inputs")
        .data(availableParameters, d => d.parameter_id)
        .enter()
        .append("text")
        .text(d => d.parameter_name)
        .attr("x", 10)
        .attr("y", (d, i) => i*30 + 20)
        .style("fill", "black")
        .style("font-size", 20)
        .on("mouseover", function(d) {
            d3.select(this).style("cursor", "pointer");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("cursor", "default");
        })
        .on("click", function(d) {
            const process_data = d3.select(this.parentNode.parentNode).datum();
            process_data.process_output.push(d);
            
            for (p of availableProcesses){
                if (p.process_input.some(o => o.parameter_id === d.parameter_id) && p.process_id !== process_data.process_id) {
                    
                    let line = container.append("line")
                    .classed("links", true)
                    .attr("x1", p.x)
                    .attr("y1", p.y)
                    .attr("x2", process_data.x)
                    .attr("y2", process_data.y)
                    .style("stroke", "black")
                    p.lines.push(line);
                    process_data.lines.push(line);
                }
            }
            
            d3.select("#output-selection").remove();
        });
    });
}

function saveAndDismissNewProcessModal() {
    let newProcess = {
        process_id: (new Date).getTime(),
        process_name: $("#process-name").val() || "default",
        process_script: $("#process-script").val(),
        process_version: $("#process-version").val() || 1.0,
        process_input: [],
        process_output: [],
        lines: [],
        x: defaultX,
        y: defaultY,
    };
    
    drawNewProcess(newProcess);
    
    $("#process-name").val("");
    $("#process-script").val("");
    $("#process-version").val("");
    
    availableProcesses.push(newProcess);
    $('#add-new-process-modal').modal('hide');
}

function saveAndDismissNewParameterModal() {
    let newParameter = {
        parameter_id: (new Date).getTime(),
        parameter_name: $("#parameter-name").val(),
        parameter_qualifier: $("#parameter-qualifier").val(),
        parameter_channel: $("#parameter-channel").val(),
        parameter_input_text: $("#parameter-input-text").val(),
        parameter_file_path: $("#parameter-file-path").val(),
        parameter_file_type: $("#parameter-file-type").val(),
        parameter_version: $("#parameter-version").val(),
    };
    
    $("#parameter-name").val("");
    $("#parameter-channel").val("");
    $("#parameter-input-text").val("");
    $("#parameter-file-path").val("");
    $("#parameter-file-type").val("");
    $("#parameter-version").val("");
    
    availableParameters.push(newParameter);
    $('#add-new-parameter-modal').modal('hide');
}




// function zoomed() {
//     svg.attr("transform", d3.event.transform);
// }


function dragged(d) {
    let dx = d3.event.sourceEvent.offsetX;
    let dy = d3.event.sourceEvent.offsetY;

    d.x = dx;
    d.y = dy;
    
    d3.select(this)
    .attr("transform", d => "translate(" + dx + "," + dy + ")");
}
