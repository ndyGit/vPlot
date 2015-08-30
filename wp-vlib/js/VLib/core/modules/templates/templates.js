<script type="text/html" class="templateListContainer">
	<div class="templateListContainer">
		<h2> <%- rc.title %> </h2>
		<div id="templateContainer"></div>
	</div>
</script>
<script type="text/html" class="templateContainer">


  <div class="btn-group">
    <button type="button" class="btn btn-primary vLibTemplate" id="template-<%- rc.index %>"><%- rc.name %></button>
    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" title="<%-rc.description%>">
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
      <li> <a href="#">Shortcode [vLib id=<%- rc.id %>]</a></li>
      <li class="divider"></li>
      <li class="vLibTemplate" id="template-<%- rc.index %>"><a href="#">Load</a></li>
      <li class="vLibTemplateDelete" id="template-<%- rc.index %>"><a href="#">Delete</a></li>

    </ul>
  </div>

</script>
