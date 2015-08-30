<?php
/*****************************************/
/* PROGRESS */
if(isset($_GET['progress_key'])) {
	$status = apc_fetch('upload_'.$_GET['progress_key']);
	echo  json_encode( $status );
	die;
}
/*****************************************/
/* FIRST CALL */
require_once("../../../wp-config.php");
$url = plugins_url('/', __FILE__).'uploadProgress.php';
?>
<script src="js/VLib/libs/jquery/jquery.min.js" type="text/javascript"></script>
<link href="css/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />

<script>
	$(document).ready(function() {
		var progressbar = jQuery('<div />',{
			class : 'progress'
		});
		var progress = jQuery('<div />',{
			class : 'progress-bar',
			id : 'upload-progress',
			'role' : 'progressbar',
			'aria-valuemin' : 0,
			'aria-valuemax' : 100,
			'style' : 'width:0%;'
		});
		progressbar.append( progress );
		$('#progress_container').append( progressbar );
		setInterval(function()
		{
			$.getJSON("<?php echo $url; ?>?progress_key=<?php echo $_GET['id']; ?>&randval="+ Math.ceil(Math.random() * 100), {
			},function(data){
				console.dir( data );
				 var progress = parseInt( data );
				 $('#progress_container').fadeIn(100);
				 $('#upload-progress').attr('style','width:'+progress+'%;');
				 $('#progress_badge').html( progress +'%' );
			}
			)},2000);
	});


</script>

<body style="margin:0px">
	<!--Progress bar divs-->
	<div id="progress_container" class="well">
	<span class="badge pull-right" id="progress_badge">0</span>
	<div>
		<span></span>
	</div>
	 </div>
 </div>
 <!---->
</body>
