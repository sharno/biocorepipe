            <div class="panel panel-default" id="ptablepanel">
                <div class="panel-heading clearfix">
                    <div class="pull-right">
                        <button type="button" class="btn btn-primary btn-sm" title="Add Process" id="addprocess" data-toggle="modal" data-target="#processmodal">Add Process</button>
                    </div>
                    <div class="pull-left">
                        <h1 class="panel-title">Process Table</h1>
                    </div>
            </div>
            <div class="panel-body">
                    <table id="processtable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Version</th>
                                <th>Script</th>
                                <th>Edit / Delete</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Version</th>
                                <th>Script</th>
                                <th>Edit / Delete</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div class="panel panel-default" id="pdetailpanel" style="display:none">
                <div class="panel-heading clearfix"> 
                    <div class="pull-right">
                        <button type="button" class="btn btn-primary btn-sm" title="Add Input / Output" id="addinout" data-toggle="modal" data-target="#pinoutmodal">Add Input / Output</button>
                    </div>
                    <div class="pull-left">
                        <h1 class="panel-title" id="pdetailpanelHead">Process Name: </h1>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="panel panel-default" id="pinputpanel">
                        <div class="panel-body">
                            <h4>Input List</h4>
                            <table id="pinputtable" class="table table-striped" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process ID</th>
                                        <th>Parameter ID</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process ID</th>
                                        <th>Parameter ID</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="panel panel-default" id="poutputpanel">
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
                                        <th>Process ID</th>
                                        <th>Parameter ID</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <p>Script</p>
                    <div class="well" id="pScriptWell">Deneme Script</div>
                </div>
            </div>
        </div>

        <div id="processmodal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="processmodaltitle">Modal title</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                            <div class="form-group" style="display:none">
                                <label for="mID" class="col-sm-2 control-label">ID</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="mID" name="id">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="mName" class="col-sm-2 control-label">Name</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="mName" name="name">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="mVersion" class="col-sm-2 control-label">Version</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="mVersion" name="version">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="mScript" class="col-sm-2 control-label">Script</label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" id="mScript" name="script" rows="4"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="saveprocess" data-clickedrow="">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="pinoutmodal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="pinoutmodaltitle">Add New Input / Output to Process</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                            <div class="form-group" style="display:none">
                                <label for="mioID" class="col-sm-2 control-label">ID</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="mioID" name="id">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="mioName" class="col-sm-2 control-label">Name</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="mioName" name="name">
                                </div>
                            </div>
                            <div class="form-group" style="display:none">
                                <label for="mioProcess" class="col-sm-2 control-label">Process ID</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="mioProcess" name="process_id">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="mioParameter" class="col-sm-2 control-label">Parameter</label>
                                <div class="col-sm-10">
                                    <select class="form-control" id="mioParameter" name="parameter_id">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="mioType" class="col-sm-2 control-label">Type</label>
                                <div class="col-sm-10">
                                    <!--<input type="text" class="form-control" id="mioType" name="type"> -->
                                    <select class="form-control" id="mioType" name="type">
                                        <option value="input">Input</option>
                                        <option value="output">Output</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="saveinout" data-clickedrow="">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>