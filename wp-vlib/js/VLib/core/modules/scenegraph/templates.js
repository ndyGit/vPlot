<script type="text/html" class="scenegraphBaseContainer">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">SceneGraph</h3>
		</div>
		<div class="panel-body">
			<div id="sceneGraph-data"></div>
			<div id="sceneGraph" class="orgChart">asd</div>
		</div>
	</div>
</script>

<script type="text/html" class="nodeContainer">
	<div class="treeNode" id="<%- rc.id %>">
		<div class="element"><h3><span class="label label-primary"><%- rc.name %></span></h3></div>
		<div class="childs"></div>
	</div>
</script>
<script type="text/html" class="treeNodeContainer">
<div class="treeNode btn btn-xs btn-default type-<%- rc.type %>" id="<%- rc.id %>">
		<img class="pluginIconSmall img-circle" src="<%- rc.icon %>" alt="<%- rc.alt %>"/><br />
		<%= rc.name %>
</div>
</script>

<script type="text/html" class="modalDialogContainer">
	<div class="modal fade" id="<%- rc.id %>">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
				<h4 class="modal-title"><%- rc.name %></h4>
			</div>
			<div class="modal-body">
				<%= rc.content %>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-default" data-dismiss="modal" id="modal-delete">Delete</button>
				<button type="button" class="btn btn-primary" data-dismiss="modal" id="modal-save">Save changes</button>
			</div>
		</div>
	</div>
</div>
</script>


<div class="panel panel-default">
	<div class="panel-heading">
	<h3 class="panel-title">Panel title</h3>
</div>
<div class="panel-body">
	<div id="vList" class="col-md-12 editor-grid">toolbox module loading...</div>
</div>
</div>
</div>