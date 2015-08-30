<script type="text/html" class="controlsContainer" id="controlsTemplate">
	<nav class="navbar navbar-default" role="navigation">
		<div class="container-fluid">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">{v}Lib.js</a>
			</div>

			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">

					<li class="active" id="refresh-template"><a href="#">
						<span class="glyphicon glyphicon-refresh"></span></a>
					</li>
					<li id="reset-template">
					<a href="#">
						<span class="glyphicon glyphicon-ban-circle"></span></a>
					</a>
				</li>
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown">
						<span class="glyphicon glyphicon-floppy-disk"></span>
						<b class="caret"></b>
					</a>
					<ul class="dropdown-menu">
						<li id="save-plot"><a href="#">Save changes</a></li>
						<li id="save-as-plot"><a href="#">Save as <b>new</b> plot</a></li>
					</ul>
				</li>
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown">
						<span class="glyphicon glyphicon-floppy-save"></span>
						<b class="caret"></b>
					</a>
					<ul class="dropdown-menu">
						<li id="save-template"><a href="#">.vlib</a></li>
						<li id="save-png"><a href="#">.png</a></li>
					</ul>
				</li>
			</ul>

			<ul class="nav navbar-nav navbar-right">
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown">files<b class="caret"></b></a>
					<ul class="dropdown-menu">
						<li id="upload-data"><a href="#">upload </a></li>
						<li id="delete-data"><a href="#">delete </a></li>
					</ul>
				</li>

			</ul>
		</div><!-- /.navbar-collapse -->
	</div>
</nav>
<div id="messageContainer"></div>

<!-- SAVE TEMPLATE MODAL -->
<div class="modal fade" id="saveTemplateModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">Save Template</h4>
			</div>
			<div class="modal-body">
				<input type="text" id="t-action" type="text" style="display:none" >

				<div class="form-group">
					<label class="control-label" for="t-id">ID:</label>
					<div class="controls">
						<input type="text" id="t-id" name="t-id" type="text" style="display:block" disabled="disabled" >
					</div>
				</div>
				<div class="form-group">
					<label class="control-label" for="t-name">Name:</label>
					<div class="controls">
						<input class="form-control" id="t-name" type="text" >
					</div>
				</div>
				<div class="form-group">
					<label class="control-label" for="t-description">Description:</label>
					<div class="controls">
						<textarea id="t-description" class="form-control" rows="3"></textarea>
					</div>
				</div>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button id="saveTemplate" type="button" class="btn btn-primary">Save </button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->


<!-- UPLOAD DATA MODAL -->
<div class="modal fade" id="uploadDataModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">Upload TSV Files</h4>
			</div>
			<div class="modal-body">

				<form id="fileUploadForm" enctype="multipart/form-data">

					<div class="form-group">
						<label class="control-label" for="ul-name">Name:</label>
						<div class="controls">
							<input class="form-control" id="ul-name" name="ul-name" type="text" >
						</div>
					</div>

					<div class="form-group">
						<label class="control-label" for="ul-description">Description:</label>
						<div class="controls">
							<textarea id="ul-description" class="form-control" name="ul-description" rows="3"></textarea>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label" for="ul-file">File:</label>
						<div class="controls">
							<input class="form-control" id="ul-file" name="ul-file" type="file" >
						</div>
					</div>

				</form>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button id="uploadFile" type="button" class="btn btn-primary">Upload </button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!-- DELETE DATA MODAL -->
<div class="modal fade" id="deleteDataModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">Delete Files</h4>
			</div>
			<div class="modal-body">
				<div class="well">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>Delete <span id="file-delete-cnt" class="badge">0</span></th>
								<th>Files <span id="file-cnt" class="badge">0</span></th>
							</tr>
						</thead>
						<tbody id="deleteDataTableContainer">

						</tbody>
					</table>
				</div>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button id="deleteFile" type="button" class="btn btn-primary">Delete </button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
</script>
