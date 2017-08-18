            <div class="panel panel-default">
                <div class="panel-heading clearfix">
                    <div class="pull-left">
                        <h1 class="panel-title">Parameter Table</h1>
                    </div>
                    <div class="pull-right">
                        <button type="button" class="btn btn-primary btn-sm" title="Add Parameter" id="addparameter" data-toggle="modal" data-target="#parametermodal">Add Parameter</button>
                    </div>
                </div>
                <div class="panel-body">
                    <table id="parametertable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Qualifier</th>
                                <th>Channel Name</th>
                                <th>Input Text</th>
                                <th>File Path</th>
                                <th>File Type</th>
                                <th>Version</th>
                                <th>Edit / Delete</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Qualifier</th>
                                <th>Channel Name</th>
                                <th>Input Text</th>
                                <th>File Path</th>
                                <th>File Type</th>
                                <th>Version</th>
                                <th>Edit / Delete</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>



            <div id="parametermodal" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="parametermodaltitle">Modal title</h4>
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
                                        <input type="text" class="form-control" id="modalName" name="name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mQualifier" class="col-sm-2 control-label">Qualifier</label>
                                    <div class="col-sm-10">
                                        <!--<input type="text" class="form-control" id="modalQualifier" name="qualifier"> -->
                                        <select class="form-control" id="modalQualifier" name="qualifier">
                                            <option value="file">file</option>
                                            <option value="set">set</option>
                                            <option value="val">val</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mChannelName" class="col-sm-2 control-label">Channel</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="modalChannelName" name="channel_name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mInputText" class="col-sm-2 control-label">Input Text</label>
                                    <div class="col-sm-10">
                                        <textarea class="form-control" id="mInputText" name="input_text" rows="3"></textarea>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mFilePath" class="col-sm-2 control-label">File Path</label>
                                    <div class="col-sm-10">
                                        <input type="url" class="form-control" id="mFilePath" name="file_path">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mFileType" class="col-sm-2 control-label">File Type</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="mFileType" name="file_type">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="mVersion" class="col-sm-2 control-label">Version</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="mVersion" name="version">
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="saveparameter" data-clickedrow="">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
