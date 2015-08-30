<?php


require_once( "../../../wp-config.php" );
require_once( ABSPATH . "wp-admin" . '/includes/image.php' );
require_once( ABSPATH . "wp-admin" . '/includes/file.php' );
require_once( ABSPATH . "wp-admin" . '/includes/media.php' );
require_once( "Query.php" );

if ( isset( $_POST[ "query" ] ) ) {
	$json = stripslashes( $_POST[ "query" ] );
	$obj = json_decode( $json, TRUE );
	queryByAction( $obj );
}

if ( isset( $_POST[ "cmd" ] ) ) {
	$json = stripslashes( $_POST[ "cmd" ] );
	$obj = json_decode( $json, TRUE );
	$action = $obj[ "action" ];
	$id = $obj[ "id" ];
	if( $action === "post_plot" ){
		$plot = getTemplateByIdQuery( $id );
		$title = $plot[ 0 ]->template_name;
		$description = $plot[ 0 ]->template_description;
		$sc = "vPlot";
	}else if( $action === "post_group" ){
		$group = getGroupByIdQuery( $id );
		$title = rawurldecode($group[ 0 ]->name);
		$description = rawurldecode($group[ 0 ]->description);
		$sc = "vGroup";
	}

	echo createPostWithShortcode( $sc, $title, $description, $id );

}
function createPostWithShortcode($shortcode, $title, $description, $id )
{
	require_once( ABSPATH . 'wp-includes/post.php' );
	// Create post object
	$post = array(
		'post_title' => $title,
		'post_content' => '['.$shortcode.' id=' . intval( $id ) . '] <br />' . $description,
		'post_status' => 'pending',
		'post_author' => 1,
		'post_category' => array( 8, 39 )
	);

	// Insert the post into the database and return last_insert_id
	return wp_insert_post( $post );
}

?>
