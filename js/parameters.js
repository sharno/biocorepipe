$(document).ready(function () {

    var parametersTable = $('#parametertable').DataTable({
        "scrollY": "400px",
        "scrollCollapse": true,
        "scrollX": true,
        "ajax": {
            "url": "ajax/ajaxquery.php",
            "dataSrc": "",
            data: {p: "getAllParameters"}
        },
        "columns": [{
                "data": "id"
            }, {
                "data": "name"
            }, {
                "data": "qualifier"
            }, {
                "data": "channel_name"
            }, {
                "data": "input_text"
            }, {
                "data": "file_path"
            }, {
                "data": "file_type"
            }, {
                "data": "version"
            }, {
                data: null,
                className: "center",
                defaultContent: getTableButtons("parameter", EDIT | REMOVE)
            }]
    });

    $('#parametermodal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');

        if (button.attr('id') === 'addparameter') {
            $('#parametermodaltitle').html('Add New Parameter');
        } else {
            $('#parametermodaltitle').html('Edit Parameter');

            var clickedRow = button.closest('tr');
            var rowData = parametersTable.row(clickedRow).data();

            $('#saveparameter').data('clickedrow', clickedRow);

            var formValues = $('#parametermodal').find('input, textarea, select');

            var keys = Object.keys(rowData);
            for (var i = 0; i < keys.length; i++) {
                $(formValues[i]).val(rowData[keys[i]]);
            }
        }
    });

    $('#parametermodal').on('click', '#saveparameter', function (event) {
        event.preventDefault();
        var formValues = $('#parametermodal').find('input, textarea, select');
        var savetype = $('#mID').val();
        var data = formValues.serializeArray(); // convert form to array
        data.push({name: "p", value: "saveParameter"});
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: false,
            success: function (s) {
                if (savetype.length) {
                    var clickedRow = $('#saveparameter').data('clickedrow');

                    var rowData = parametersTable.row(clickedRow).data();
                    var keys = Object.keys(rowData);

                    for (var i = 0; i < keys.length; i++) {

                        var key = keys[i];
                        if (key !== 'id') {
                            rowData[key] = $(formValues[i]).val();
                        }
                    }

                    parametersTable.row(clickedRow).data(rowData).draw();

                } else {

                    var addData = {};
                    var keys = parametersTable.settings().init().columns;
                    alert("Here");
                    for (var i = 0; i < keys.length; i++) {

                        var key = keys[i].data;
                        if (key === 'id') {
                            addData[key] = s.id;
                        } else if (key !== null) {
                            addData[key] = $(formValues[i]).val();
                        }
                    }
                    parametersTable.row.add(addData).draw();
                }

                $('#parametermodal').modal('hide');

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    $('#parametertable').on('click', '#parameterremove', function (e) {
        e.preventDefault();

        var clickedRow = $(this).closest('tr');
        var rowData = parametersTable.row(clickedRow).data();

        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                id: rowData.id,
                p: "removeParameter"
            },
            async: false,
            success: function (s) {
                parametersTable.row(clickedRow).remove().draw();
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });


});
