<script type="text/html" class="pluginConfigForm" id="axesCube">
	<form class="form-horizontal" role="form">
		<li class="list-group-item">
			<div class="well">
				<h3>Labels</h3>
				<div class="input-group">
					<span class="input-group-addon">x</span>
					<input class="form-control" type="text" id="xLabel">
				</div><br/>
				<div class="input-group">
					<span class="input-group-addon">y</span>
					<input class="form-control" type="text" id="yLabel">
				</div><br/>
				<div class="input-group">
					<span class="input-group-addon">z</span>
					<input class="form-control" type="text" id="zLabel">
				</div>
			</div>
		</li>

		<li class="list-group-item">
			<div class="well">
				<h3>Borders</h3>

				<h4>Minimum values</h4>
				<span class="label label-info">"auto" or custom value.</span>
				<div style="margin-top:10px;">
					<div class="input-group">
						<span class="input-group-addon">x</span>
						<input class="form-control" type="text" id="xMin">
						<span class="input-group-addon">y</span>
						<input class="form-control" type="text" id="yMin">
						<span class="input-group-addon">z</span>
						<input class="form-control" type="text" id="zMin">
					</div>
				</div>
				<h4>Maximum values</h4>
				<span class="label label-info">"auto" or custom value.</span>
				<div style="margin-top:10px;">
					<div class="input-group">
						<span class="input-group-addon">x</span>
						<input class="form-control" type="text" id="xMax">
						<span class="input-group-addon">y</span>
						<input class="form-control" type="text" id="yMax">
						<span class="input-group-addon">z</span>
						<input class="form-control" type="text" id="zMax">
					</div>
				</div>

				<div style="margin-top:10px;">
					<div class="input-group">
						<span class="input-group-addon">
							<input type="checkbox" id="showHeatmapRange">
						</span>
						<input type="text" class="form-control" disabled value="show heatmap">
					</div>
				</div>
			</div>

		</li>
		<li class="list-group-item">
			<div class="well">
				<h3>Tick Labels</h3>
				<h4>Steps</h4>
				<div style="margin-top:10px;"/>
					<div class="input-group">
						<span class="input-group-addon">
							<input type="checkbox" id="stepType">
						</span>
						<input id="niceSteps" type="text" class="form-control" disabled value="">
					</div>
				<div style="margin-top:10px;"/>
				<div class="input-group">
					<span class="input-group-addon">x</span>
					<input class="form-control" type="text" id="granularity-x">
				</div>
				<div id="granularitySliderX"></div>

				<div class="input-group">
					<span class="input-group-addon">y</span>
					<input class="form-control" type="text" id="granularity-y">
				</div>
				<div id="granularitySliderY"></div>

				<div class="input-group">
					<span class="input-group-addon">z</span>
					<input class="form-control" type="text" id="granularity-z">
				</div>
				<div id="granularitySliderZ"></div>
				<h4>Format</h4>
				<h5>Fontsize</h5>
				<div class="input-group">
					<span class="input-group-addon">px</span>
					<input class="form-control" type="text" id="fontSize">
				</div>
				<h5>Round to decimal places</h5>
				<div class="input-group">
					<span class="input-group-addon">x</span>
					<input class="form-control" type="text" id="mantissa-x">
					<span class="input-group-addon">y</span>
					<input class="form-control" type="text" id="mantissa-y">
					<span class="input-group-addon">z</span>
					<input class="form-control" type="text" id="mantissa-z">
				</div>

			</div>
		</li>
		<li class="list-group-item">
			<div class="well">
				<h3>Raster</h3>
				<div style="margin-top:10px;">


					<span class="label label-info">show x-y & opacity</span>
					<div class="input-group">
						<span class="input-group-addon">
							<input type="checkbox" id="xy-raster-show">
						</span>
						<input class="form-control" type="text" id="raster-xy">
					</div>
					<div id="raster-xy-slider"></div><br />

					<span class="label label-info">show x-z & opacity</span>
					<div class="input-group">
						<span class="input-group-addon">
							<input type="checkbox" id="xz-raster-show">
						</span>
						<input class="form-control" type="text" id="raster-xz">
					</div>
					<div id="raster-xz-slider"></div><br />

					<span class="label label-info">show y-z & opacity</span>
					<div class="input-group">
						<span class="input-group-addon">
							<input type="checkbox" id="yz-raster-show">
						</span>
						<input class="form-control" type="text" id="raster-yz">
					</div>
					<div id="raster-yz-slider"></div><br />



				</div>
			</div>


		</div>

	</div>

</li>
</form>

</script>
