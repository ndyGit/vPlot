<script type="text/html" class="pluginConfigForm" id="lineplot">
	<ul class="nav nav-tabs" role="tablist">
		<li class="active"><a href="#config-tab" role="tab" data-toggle="tab">Config</a></li>
		<li><a href="#scaling-tab" role="tab" data-toggle="tab">Scaling</a></li>
	</ul>
	<div class="tab-content">
		<div class="tab-pane active" id="config-tab">
			<ul class="list-group">
				<li class="list-group-item">
					<h3>LinePlot</h3>
				</li>
				<li class="list-group-item">

					<label class="control-label" for="name">Name</label>
					<div class="controls">
						<input class="form-control" type="text" id="name">
					</div>
				</li>
				<li class="list-group-item">
					<label class="control-label" for="">Type</label>
					<div class="radio">
						<label>
							<input type="radio" name="optionLinetype" id="optionLinetype" value="solid" checked>
							solid
						</label>
					</div>
					<div class="radio">
						<label>
							<input type="radio" name="optionLinetype" id="optionLinetype" value="dashed">
							dashed
						</label>
					</div>
					<div class="radio">
						<label>
							<input type="radio" name="optionLinetype" id="optionLinetype" value="dotted">
							dotted
						</label>
					</div>
				</li>
				<li class="list-group-item">
					<div class="form-group">
						<label class="control-label" for="lineWidth">Line Width</label>
						<div class="controls">
							<input class="form-control" type="text" id="lineWidth">
							<div id="lineWidthSlider"></div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="tab-pane" id="scaling-tab">
			<ul class="list-group">
				<li class="list-group-item">
					<h3>Scale</h3>
				</li>
				<li class="list-group-item">
					<div class="form-group">
						<label class="control-label" for="xScale">X scale</label>
						<div class="controls">
							<input class="form-control" type="text" id="xScale">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label" for="yScale">Y scale</label>
						<div class="controls">
							<input class="form-control" type="text" id="yScale">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label" for="zScale">Z scale</label>
						<div class="controls">
							<input class="form-control" type="text" id="zScale">
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</script>
