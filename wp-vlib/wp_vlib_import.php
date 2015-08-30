<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<title>PlotList</title>
	<style>
		.center {
			text-align: center;
		}

		#progressbar : {
			border: 0px;
			height: 50px;
			width: 100%;
			display: none;
		}

	</style>
</head>
<body>
<div class="container">
	<div class="page-header">
		<h3>Import
			<small>{v}Plot.js</small>
		</h3>
	</div>
	<div class="well well-sm">
		Import <b>Datasets</b>, <b>Plots</b> and <b>Groups</b>.
	</div>
	<div class="panel panel-default">
		<div class="panel-body">
			<form role="form" id="upload-form" method="POST" enctype="multipart/form-data">

				<div class="form-group" id="form-group-name" style="display:none;">
					<label for="name">Name</label>
					<input type="text" class="form-control" id="name" name="upload-form-name"
					       placeholder="Name">
					<hr>
				</div>
				<div class="form-group" id="form-group-description" style="display:none;">
					<label for="name">Description</label>
					<textarea class="form-control" rows="3" id="description" name="upload-form-description"
					          placeholder="Description"></textarea>
					<hr>
				</div>

				<div class="form-group" id="form-group-create-group" style="display:none;">
					<label for="upload-form-create-group" >Create Group</label><br />
					<input id="upload-form-create-group" name="upload-form-create-group" type="checkbox">
					<hr>
				</div>
				<div class="form-group" id="form-group-file-vivible" style="display:none;">
					<label for="upload-form-file-visible" >Mark datasets as visible</label><br />
					<p class="help-block">This means that datasets will be selectable within the Plot-Editor.</p>
					<input id="upload-form-file-visible" name="upload-form-file-visible" type="checkbox">
					<hr>
				</div>
				<div id="upload-input-container">
				</div>
				<div id="progressbar" style="width:100%; display: none;"></div>
				<div id="upload-info"></div>

				<div id="msg"></div>
				<div class="modal-footer">
					<button type="button" id="file-upload-submit" class="btn btn-primary">Upload</button>
				</div>

			</form>

		</div>
	</div>

</body>

</body>
</html>


