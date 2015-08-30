<script type="text/html" class="pluginConfigForm" id="dataset2d">
	<form class="form-horizontal" role="form">


		 <div class="form-group">
		 	<div class="well">
		 		<span class="input-group">Name</span>
				<input id="dataset-name" type="text" class="form-control" placeholder="">
		 	</div>
		 	<div class="well">
		 	<label class="control-label" for="data"></label>
			 <div class="controls">
			 	<input class="form-control" type="text" id="data" style="display:none;" />
				<div class="input-group">
					<span class="input-group-addon">x</span>
					<input id="dataset-x" type="text" class="form-control" placeholder="">
					<span class="input-group-addon">y</span>
					<input id="dataset-y" type="text" class="form-control" placeholder="">
				</div>
			 </div>
			 <br/>
			 <button id="addDataset" type="button" class="btn btn-default btn-lg btn-block">Add</button>
			 </div>
			 <div class="well">
			 <table class="table table-hover">
			 <thead>
			 	<tr>
			 		<th>x</th>
			 		<th>y</th>
			 		<th></th>
			 	</tr>
			 </thead>
			 <tbody id="dataTableContainer">

			 </tbody>
			</table>
			</div>
		 </div>

	</form>
</script>
