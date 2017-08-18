function getInputTable(id) {
    inputTable = $('#pinputtable').DataTable({
            "scrollY": "400px",
            "scrollCollapse": true,
            "scrollX": true,
            "destroy": true,
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: {process_id: id,
                    type: 'input',
                    p: "getAllProcessParameters"},
                dataSrc: ""
            },
            "columns": [{
                    "data": "id"
                }, {
                    "data": "name"
                }, {
                    "data": "process_name"
                }, {
                    "data": "version"
                }, {
                    "data": "type"
                }, {
                    data: null,
                    className: "center",
                    defaultContent: getTableButtons('input', REMOVE)
                }]
        });
      return inputTable;

}
function getOutputTable(id) {
     outputTable = $('#poutputtable').DataTable({
            "scrollY": "400px",
            "scrollCollapse": true,
            "scrollX": true,
            "destroy": true,
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: {process_id: id,
                       type: 'output',
                       p: "getAllProcessParameters"},
                "dataSrc": ""
            },
            "columns": [{
                    "data": "id"
                }, {
                    "data": "name"
                }, {
                    "data": "process_name"
                }, {
                    "data": "version"
                }, {
                    "data": "type"
                }, {
                    data: null,
                    className: "center",
                    defaultContent: getTableButtons('output', REMOVE)
            }]
        });
return outputTable
}
$(document).ready(function () {
    var inputTable = null;
    var outputTable = null;
    var selProcessID = null;
    var processTable = $('#processtable').DataTable({
        "scrollY": "400px",
        "scrollCollapse": true,
        "scrollX": true,
        "ajax": {
            url: "ajax/ajaxquery.php",
            data: {"p": "getAllProcesses"},
            "dataSrc": ""
        },
        "columns": [{
                "data": "id"
            }, {
                "data": "name"
            }, {
                "data": "version"
            }, {
                "data": "script"
            }, {
                data: null,
                className: "center",
                defaultContent: getTableButtons("process", SELECT | EDIT | REMOVE)
            }]
    });
    
    
    $('#processtable').on('click', '#processselect', function () {
        var clickedRow = $(this).closest('tr');

        if (clickedRow.hasClass('selected')) {
            clickedRow.removeClass('selected');
            $("#pdetailpanel").css("display", "none");
        } else {
            processTable.$('tr.selected').removeClass('selected');
            clickedRow.addClass('selected');

            var rowData = processTable.row(clickedRow).data();
            console.log(rowData)
            $('#pdetailpanelHead').html(rowData['name']);
            $('#pScriptWell').html(rowData['script']);
            selProcessID = rowData['id'];

            inputTable = getInputTable(selProcessID)
            outputTable = getOutputTable(selProcessID)


            $("#pdetailpanel").removeAttr("style");
        }
    });

    $('#pinoutmodal').on('show.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $('#mioProcess').val(selProcessID);

        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {p: "getAllParameters"},
            async: false,
            success: function (s) {
                $("#mioParameter").empty();
                for (var i = 0; i < s.length; i++) {
                    var param = s[i];
                    var option = new Option(param.name, param.id);
                    $(option).html(param.name);
                    $("#mioParameter").append(option);
                }
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    // Add input and output
    $('#pinoutmodal').on('click', '#saveinout', function (event) {
        event.preventDefault();
        var formValues = $('#pinoutmodal').find('input, select');
        type = $('#mioType').val();
        var data = formValues.serializeArray(); // convert form to array
        data.push({name: "p", value: "saveProcessParameter"});
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: true,
            success: function (s) {
                var addData = {};
                var keys = inputTable.settings().init().columns;
                for (var i = 0; i < keys.length; i++) {

                    var key = keys[i].data;
                    if (key === 'id') {
                        addData[key] = s.id;
                    } else if (key !== null) {
                        addData[key] = $(formValues[i]).val();
                    }
                }

                if (type === 'input') {
                    inputTable.row.add(addData).draw();
                } else {
                    outputTable.row.add(addData).draw();
                }

                $('#pinoutmodal').modal('hide');

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    // Remove rows from input
    $('#pinputtable').on('click', '#inputremove', function (e) {
        e.preventDefault();
        var clickedRow = $(this).closest('tr');
        var rowData = inputTable.row(clickedRow).data();

        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                id: rowData.id,
                p: "removeProcessParameter"
            },
            async: true,
            success: function () {
                inputTable.row(clickedRow).remove().draw();
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });
    
    // Remove rows output tables
    $('#poutputtable').on('click', '#outputremove',function (e) {
        e.preventDefault();
        var clickedRow = $(this).closest('tr');
        var rowData = outputTable.row(clickedRow).data();

        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                id: rowData.id,
                p: "removeProcessParameter"
            },
            async: true,
            success: function () {
                outputTable.row(clickedRow).remove().draw();
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    $('#processmodal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');

        if (button.attr('id') === 'addprocess') {
            $('#processmodaltitle').html('Add New Process');
        } else {
            $('#processmodaltitle').html('Edit Process');

            var clickedRow = button.closest('tr');
            var rowData = processTable.row(clickedRow).data();

            $('#saveprocess').data('clickedrow', clickedRow);

            var formValues = $('#processmodal').find('input, textarea');

            var keys = Object.keys(rowData);
            for (var i = 0; i < keys.length; i++) {
                $(formValues[i]).val(rowData[keys[i]]);
            }
        }
    });

    $('#processmodal').on('click', '#saveprocess', function (event) {
        event.preventDefault();
        var formValues = $('#processmodal').find('input, textarea');
        var savetype = $('#mID').val();
        var data = formValues.serializeArray(); // convert form to array
        data.push({name: "p", value: "saveProcess"});
        
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: true,
            success: function (s) {

                if (savetype.length) {
                    var clickedRow = $('#saveprocess').data('clickedrow');

                    var rowData = processTable.row(clickedRow).data();
                    var keys = Object.keys(rowData);

                    for (var i = 0; i < keys.length; i++) {

                        var key = keys[i];
                        if (key !== 'id' && key != "") {
                            rowData[key] = $(formValues[i]).val();
                        }
                    }

                    processTable.row(clickedRow).data(rowData).draw();

                } else {
                    var addData = {};
                    var keys = processTable.settings().init().columns;

                    for (var i = 0; i < keys.length; i++) {

                        var key = keys[i].data;
                        if (key === 'id') {
                            addData[key] = s.id;
                        } else if (key !== null) {
                            addData[key] = $(formValues[i]).val();
                        }
                    }

                    processTable.row.add(addData).draw();
                }

                $('#processmodal').modal('hide');

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    $('#processtable').on('click', '#processremove', function (e) {
        e.preventDefault();

        var clickedRow = $(this).closest('tr');
        var rowData = processTable.row(clickedRow).data();

        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                id: rowData.id,
                p: "removeProcess"
            },
            async: true,
            success: function (s) {
                processTable.row(clickedRow).remove().draw();
                $("#pdetailpanel").css("display", "none");
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });


    });

});
