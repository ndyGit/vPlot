<?php
/**
 * Project vPlot
 * Author: Andreas Gratzer
 * Date: 17/09/14
 * Time: 18:04
 */
require_once( "../../../wp-config.php" );
require_once( ABSPATH . "wp-admin" . '/includes/image.php' );
require_once( ABSPATH . "wp-admin" . '/includes/file.php' );
require_once( ABSPATH . "wp-admin" . '/includes/media.php' );


function ensureJSON($input) {
	$json = $input;

	if(is_array($input) || is_string($input)) {
		$json = json_encode( $input );
		if(json_last_error() !== JSON_ERROR_NONE){
			$json = false;
		}
	}

	return $json;
}


function queryByAction( $obj )
{

	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_templates";
	$action = htmlspecialchars( trim( $obj[ 'action' ] ) );
	switch ( $action ) {
		/* ************************** */
		/* PLOTS */
		case 'save':
			$name = $obj[ 'name' ];
			$descr = $obj[ 'description' ];
			$graph = $obj[ 'sceneGraph' ];
			$placeholders = $obj[ 'placeholders' ];
			$thumbnail = $obj[ 'thumbnail' ];

			$tId = createTemplateQuery( $name, $descr, $graph, $thumbnail );
			foreach ( $placeholders as $pattern ) {
				$pId = createPlaceholderQuery( $pattern );
				createTemplateHasPlaceholderQuery( $tId, $pId );
			}
			echo $tId;
			break;
		case 'update_t':
			$tId = $obj[ 'id' ];
			$name = $obj[ 'name' ];
			$descr = $obj[ 'description' ];
			$graph = $obj[ 'sceneGraph' ];
			$placeholders = $obj[ 'placeholders' ];
			$thumbnail = $obj[ 'thumbnail' ];

			/* delete patterns */
			$patterns = getPlaceholdersByPlotIdQuery( $tId );

			if ( $patterns ) {
				foreach ( $patterns as $pattern ) {
					deletePlaceholderByIdQuery( $pattern->id );
				}
				/* delete plot-pattern mappings */
				deleteTemplateHasPlaceholderQuery( $tId );
			}
			foreach ( $placeholders as $pattern ) {
				$pId = createPlaceholderQuery( $pattern );
				createTemplateHasPlaceholderQuery( $tId, $pId );
			}
			updateTemplateQuery( $tId, $name, $descr, $graph, $thumbnail );
			print "Template <b>$name</b> has been updated.";
			break;
		case 'delete_t':
			$name = $obj[ 'name' ];
			$tId = $obj[ "id" ];
			/* delete patterns */
			$patterns = getPlaceholdersByPlotIdQuery( $tId );

			if ( $patterns ) {
				foreach ( $patterns as $pattern ) {
					deletePlaceholderByIdQuery( $pattern->id );
				}
				/* delete plot-pattern mappings */

				deleteTemplateHasPlaceholderQuery( $tId );
			}

			/* delete plot*/
			$results = deleteTemplateByIdQuery( $tId );
			if ( $results === 1 ) {
				print $results;
			} else {
				print "There has been an error deleting the template!";
			}

			break;
		case 'get_t':
			$results = getTemplatesQuery();
			if ( count( $results ) > 0 ) {
				print json_encode( $results );
			}
			break;
		case 'get_t_id':
			$id = $obj[ 'id' ];
			$results = getTemplateByIdQuery( $id );
			if ( count( $results ) > 0 ) {
				print json_encode( $results );
			}
			break;
		/* ************************** */
		/* GROUPS */
		case 'save-group':
			$name = $obj[ 'group' ][ 'config' ][ 'name' ];
			$descr = $obj[ 'group' ][ 'config' ][ 'description' ];
			$group = $obj[ 'group' ];
			print createGroupQuery( $name, $descr, $group );

			break;
		case 'load-group':
			$id = $obj[ 'id' ];
			$result = getGroupByIdQuery( $id );
			$response = array(
				id => $result[ 0 ]->id,
				name => $result[ 0 ]->name,
				description => $result[ 0 ]->description,
				group => json_decode( $result[ 0 ]->group_json ),
			);
			print json_encode( $response );
			break;
		case 'load-all-groups':
			$result = getAllGroups();
			print json_encode( $result );
			break;
		case 'load-all-group-definitions':
			$result = getAllGroupDefinitions();
			print json_encode( $result );
			break;
		case 'delete-group':
			$id = $obj[ "id" ];
			return deleteGroupQuery( $id );
			break;
		case 'update-group':
			$id = $obj[ "id" ];
			$name = $obj[ 'group' ][ 'config' ][ 'name' ];
			$description = $obj[ 'group' ][ 'config' ][ 'description' ];
			$group = $obj[ 'group' ];
			return updateGroupQuery( $id, $name, $description, $group );
			break;
		/* ************************** */
		/* FILES */
		case 'get_file_by_id':
			$id = $obj[ 'id' ];
			$results = getFileByIdQuery( $id );
			echo json_encode( $results );
			break;
		case 'get_files':
			$results = getFilesQuery();
			echo json_encode( $results );
			break;
		case 'update-file-visibility':
			$id = $obj[ "id" ];
			$isVisible = $obj[ 'isVisible' ];

			echo updateFileVisibilityQuery( $id, $isVisible );
			break;
		case 'get_visible_files':
			$results = getVisibleFilesQuery();
			if ( count( $results ) > 0 ) {
				print json_encode( $results );
			}
			break;
		case 'delete_files':
			$files_ids = implode( ",", $obj[ 'files' ] );

			$dataFolder = "data/";
			/* unlink */
			foreach ( $obj[ 'files' ] as $fileId ) {
				$file = getFileByIdQuery( $fileId );
				echo "try to unlink " . $dataFolder . $file[ 0 ]->file_path;
				if ( $file[ 0 ]->file_path !== "" ) {
					echo "try to unlink " . $dataFolder . $file[ 0 ]->file_path;
					if ( !unlink( $dataFolder . $file[ 0 ]->file_path ) ) {
						echo "unlink( " . $file[ 0 ]->file_path . " ) failed.";
					} else {
						echo "unlink " . $dataFolder . $file[ 0 ]->file_path;
					}
				}
			}
			$results = deleteFilesQuery( $files_ids );
			if ( count( $results ) > 0 ) {
				print $results;
			} else {
				print "There has been an error deleting the file! ";
			}
			break;
		default:
	}
}

/************************************/
/* GROUP */
function createTemplateHasPlaceholderQuery( $tId, $pId )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_template_has_placeholder";
	$insert = "INSERT INTO " . $table_name .
		" (template_id, placeholder_id) " .
		"VALUES (" . intval( $tId ) . "," . intval( $pId ) . ")";
	return $wpdb->query( $insert );

}

function deleteTemplateHasPlaceholderQuery( $plotId )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_template_has_placeholder";
	$delete = "DELETE FROM " . $table_name .
		" WHERE template_id=" . intval( $plotId );
	$results = $wpdb->query( $delete );
	return $results;
}

function getTemplateHasPlaceholderByPlotIdQuery( $plotId )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_template_has_placeholder";
	$delete = "SELECT * FROM " . $table_name .
		" WHERE template_id=" . intval( $plotId );
	$results = $wpdb->query( $delete );
	return $results;
}

function createPlaceholderQuery( $pattern )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_placeholder";
	$sql = "INSERT INTO " . $table_name .
		" (pattern) " .
		"VALUES ( %s )";
	$results = $wpdb->query( $wpdb->prepare( $sql, $pattern ) );
	return $wpdb->insert_id;
}

function deletePlaceholderByIdQuery( $id )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_placeholder";
	$delete = "DELETE FROM " . $table_name .
		" WHERE id=" . intval( $id );
	$results = $wpdb->query( $delete );
	return $results;
}

function getPlaceholdersByPlotIdQuery( $id )
{
	global $wpdb;
	$table_placeholder = $wpdb->prefix . "vlib_placeholder";
	$table_template_has_placeholder = $wpdb->prefix . "vlib_template_has_placeholder";

	$sql = "SELECT * FROM $table_placeholder "
		. "LEFT JOIN $table_template_has_placeholder ON $table_template_has_placeholder.placeholder_id = $table_placeholder.id "
		. "WHERE $table_template_has_placeholder.template_id = " . intval( $id );

	$results = $wpdb->get_results( $sql );
	return $results;
}

/************************************/
/* TEMPLATES */
function createTemplateQuery( $name, $descr, $graph, $thumbnail )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_templates";
	$sql = "INSERT INTO " . $table_name .
		" (time, template_name, template_description, template_graph, template_thumbnail) " .
		"VALUES (now(), %s,%s,%s,%s)";


	$wpdb->query( $wpdb->prepare( $sql, $name, $descr, ensureJSON($graph) , $thumbnail ) );

	return $wpdb->insert_id;
}

function updateTemplateQuery( $id, $name, $descr, $graph, $thumbnail )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_templates";

	$sql = "UPDATE " . $table_name .
		" SET time = now(), " .
		" template_name = %s, " .
		" template_description = %s, " .
		" template_graph = %s, " .
		" template_thumbnail = %s " .
		" WHERE id = %d";

	$results = $wpdb->query( $wpdb->prepare( $sql, $name, $descr, ensureJSON($graph), $thumbnail, $id ) );
	return $results;
}

function getTemplatesQuery()
{
	global $wpdb;
	$table_templates = $wpdb->prefix . "vlib_templates";
	$table_placeholder = $wpdb->prefix . "vlib_placeholder";
	$table_template_has_placeholder = $wpdb->prefix . "vlib_template_has_placeholder";

	$sql = "SELECT ".
		" $table_templates.id, ".
		" $table_templates.template_name, ".
		" $table_templates.template_description, ".
		" $table_templates.template_graph, ".
		" $table_templates.template_thumbnail, ".
		" DATE_FORMAT($table_templates.time,'%d %b %Y %T') as time, " .
		" GROUP_CONCAT(wp_vlib_placeholder.pattern  SEPARATOR ',') AS pattern " .
		"FROM $table_templates " .
		"LEFT JOIN $table_template_has_placeholder ON $table_templates.id = $table_template_has_placeholder.template_id " .
		"LEFT JOIN $table_placeholder ON $table_placeholder.id = wp_vlib_template_has_placeholder.placeholder_id " .
		"GROUP BY wp_vlib_templates.id ";

	$results = $wpdb->get_results( $sql ) or die( mysql_error() );

	return $results;
}

function deleteTemplateByIdQuery( $id )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_templates";
	$delete = "DELETE FROM " . $table_name .
		" WHERE id=" . intval( $id );
	$results = $wpdb->query( $delete );
	return $results;
}

function getTemplateByIdQuery( $id )
{
	global $wpdb;
	$table_templates = $wpdb->prefix . "vlib_templates";
	$table_placeholder = $wpdb->prefix . "vlib_placeholder";
	$table_template_has_placeholder = $wpdb->prefix . "vlib_template_has_placeholder";

	$sql = "SELECT $table_templates.*, GROUP_CONCAT(wp_vlib_placeholder.pattern  SEPARATOR ',') AS pattern " .
		"FROM $table_templates " .
		"LEFT JOIN $table_template_has_placeholder ON $table_templates.id = $table_template_has_placeholder.template_id " .
		"LEFT JOIN $table_placeholder ON $table_placeholder.id = wp_vlib_template_has_placeholder.placeholder_id " .
		"WHERE $table_templates.id=" . intval( $id ) .
		" GROUP BY wp_vlib_templates.id ";

	$results = $wpdb->get_results( $sql ) or die( mysql_error() );
	return $results;
}


/************************************/
/* GROUP */
function createGroupQuery( $name, $description, $group )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_group";
	$sql = "INSERT INTO " . $table_name .
		" (time, name, description, group_json) " .
		"VALUES (now(), %s ,%s, %s)";
	$wpdb->query( $wpdb->prepare( $sql, $name, $description, json_encode( $group ) ) );
	return $wpdb->insert_id;
}

function updateGroupQuery( $id, $name, $description, $group )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_group";
	$sql = "UPDATE " . $table_name .
		" SET time = now(), " .
		" name = %s, " .
		" description = %s," .
		" group_json = %s" .
		" WHERE id= %d";

	$wpdb->query( $wpdb->prepare( $sql, $name, $description, json_encode( $group ), $id ) );
	return $wpdb->insert_id;
}

function deleteGroupQuery( $id )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_group";
	$insert = "DELETE FROM " . $table_name .
		" WHERE id=" . intval( $id );
	return $wpdb->query( $insert );
}

function getGroupByIdQuery( $id )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_group";
	$sql = "SELECT * FROM " . $table_name .
		" WHERE id=" . intval( $id );
	return $wpdb->get_results( $sql );
}

function getAllGroups()
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_group";
	$sql = "SELECT id, name, description, group_json AS group, " .
		" DATE_FORMAT(time,'%d %b %Y %T') as time " .
		" FROM " . $table_name;
	return $wpdb->get_results( $sql );

}

function getAllGroupDefinitions()
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_group";
	$sql = "SELECT id, name, description, " .
		" DATE_FORMAT(time,'%d %b %Y %T') as time " .
		" FROM " . $table_name;
	return $wpdb->get_results( $sql );

}

/************************************/
/* FOLDER */
/*
function createFolderQuery( $name, $description, $path )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_folder";
	$insert = "INSERT INTO " . $table_name .
		" (time, name, description, path) " .
		"VALUES (now(),'$name','$description', '$path')";
	$wpdb->query( $insert );
	return $wpdb->insert_id;
}

function deleteFolderQuery( $id )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_folder";
	$insert = "DELETE FROM " . $table_name .
		" WHERE id=" . intval($id);
	$wpdb->query( $insert );
	return $wpdb->insert_id;
}

function updateFolderQuery( $id, $name, $description )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_folder";
	$insert = "UPDATE " . $table_name .
		" SET " .
		" time=now()," .
		" name='$name'," .
		" description='$description'" .
		" WHERE id=".intval($id);
	$wpdb->query( $insert );
	return $wpdb->insert_id;
}
*/
/************************************/
/* FILE */
function createFileQuery( $name, $description, $path, $isVisible = false )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_files";
	$visible = $isVisible ? 1 : 0;
	$insert = "INSERT INTO " . $table_name .
		" (time, file_name, file_description, full_file_name, file_path, file_is_visible) " .
		"VALUES (now(),'$name','$description','" . basename( $path ) . "', '$path', $visible)";
	$wpdb->query( $insert );
	return $wpdb->insert_id;
}

function deleteFileQuery( $id )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_files";
	$insert = "DELETE FROM " . $table_name .
		" WHERE id=" . intval( $id );
	return $wpdb->query( $insert );
}

function getFileByIdQuery( $id )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_files";
	$insert = "SELECT *  FROM " . $table_name .
		" WHERE id=" . intval( $id );
	return $wpdb->get_results( $insert );
}

function updateFileVisibilityQuery( $id, $isVisible )
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_files";
	$visible = $isVisible ? 1 : 0;
	$insert = "UPDATE " . $table_name .
		" SET " .
		" file_is_visible = " . $visible .
		" WHERE id=" . intval( $id );
	return $wpdb->query( $insert );
}

function getFilesQuery()
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_files";
	$sql = "SELECT " .
		" id, " .
		" file_name, " .
		" file_description, " .
		" file_path, " .
		" full_file_name, " .
		" file_is_visible, " .
		" DATE_FORMAT(time,'%d %b %Y %T') as time " .
		" FROM " . $table_name;
	$results = $wpdb->get_results( $sql );
	return $results;
}

function getVisibleFilesQuery()
{
	global $wpdb;
	$table_name = $wpdb->prefix . "vlib_files";
	$sql = "SELECT * FROM " . $table_name . " WHERE file_is_visible = 1";
	$results = $wpdb->get_results( $sql );
	return $results;
}

function deleteFilesQuery( $files_ids )
{
	global $wpdb;
	$delete = "DELETE FROM " . $wpdb->prefix . "vlib_files" .
		" WHERE id IN (" . $files_ids . ")";
	$results = $wpdb->query( $delete );
	return $results;
}

