<script type="text/html" class="pluginListContainer">
<div class="pluginListContainer">
<h2> <%- rc.title %> </h2>

<% _.each(rc.plugins,function(plugin){ %>
	<div id="plugin-<%- plugin.type %>-<%- plugin.name %>" class="plugin btn btn-default btn-large info-type-<%- plugin.type %>" title="<%-plugin.description%>" data-toggle="tooltip" data-placement="top" >
	<div class="btn-group">
	<img class="pluginIcon img-circle" src="<%- rc.path %><%- plugin.icon %>" alt="<%- plugin.type %>"/><br />
	<%- plugin.name %>
	</div>
	</div>
	<% }); %>
</div>

</script>
<script type="text/html" class="pluginDragHelperContainer">
<div id="test" class="pluginDrag btn btn-inverse btn-primary">
<img class="pluginIcon img-rounded"src="<%- rc.icon %>" alt="<%- rc.name %>"/>
</div>
</script>
