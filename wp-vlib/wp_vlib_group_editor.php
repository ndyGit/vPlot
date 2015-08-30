<?php
/**
 * Author: Andreas Gratzer
 * Date: 03/10/14
 * Time: 09:01
 */
?>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<title>Group Editor</title>
	<style>
		.btn-default, .btn-primary, .btn-success, .btn-info, .btn-warning, .btn-danger{
			text-shadow: none;
		}
	</style>
</head>
<body>
<div class="">

	<div class="row">
		<div class="col-md-12">
			<nav class="navbar navbar-default" role="navigation">
				<div class="container-fluid">
					<!-- Brand and toggle get grouped for better mobile display -->
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
						        data-target="#bs-example-navbar-collapse-1">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
						<span class="btn navbar-btn disabled navbar-brand">
							Group-Creator <small>{v}Plot.js</small>
						</span>
					</div>
					<form class="navbar-form navbar-right" role="search">
						<button type="button" class="btn btn-default navbar-btn" id="group-map-plot-to-file">Map best plot to file
						</button>
						<button type="button" class="btn btn-primary navbar-btn" id="group-save">Save</button>
					</form>

				</div>
				<!-- /.container-fluid -->
			</nav>
		</div>
	</div>

	<div class="row">
		<div class="col-md-6">
			<div class="panel panel-default">
				<div class="panel-heading">Group-Editor</div>
				<div id="group-editor-container"></div>
				<div class="panel-body" id="treeContainer">
				</div>
			</div>
		</div>
		<div class="col-md-2">
			<div class="panel panel-default">
				<div class="panel-heading">Group</div>
				<div class="panel-body">
					<div id="group-container"></div>
				</div>
			</div>
		</div>
		<div class="col-md-4">
			<div class="panel panel-default">
				<div class="panel-heading">Show</div>
				<div class="panel-body">
					<div id="plot-container"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	console.log( "WP-BACKEND-GROUP-EDIT" );
</script>
</body>
</html>
