<?php


/*
Plugin Name: vPlot
Plugin URI: yettie.at
Description: A data visualization tool.
Author: AG
Version: 6.3
Author URI: yettie.at
*/

wp_register_script( 'require', plugins_url( 'js/VLib/libs/vendor/requirejs/require.js', __FILE__ ), false, '1.0', true );
wp_register_style( 'vlib_bootstrap', plugins_url( 'js/VLib/libs/vendor/bootstrap/dist/css/bootstrap.min.css', __FILE__ ) );
wp_register_style( 'vlib_bootstrap_theme', plugins_url( 'js/VLib/libs/vendor/bootstrap/dist/css/bootstrap-theme.min.css', __FILE__ ) );
//wp_register_style( 'vlib_jquery_ui', plugins_url('css/custom-theme/jquery-ui-1.10.0.custom.css', __FILE__) );
wp_register_style( 'vlib_pageStyle', plugins_url( 'css/pageStyle.css', __FILE__ ) );

/****************************************/
/* LOAD SCRIPTS AND STYLES NEEDED BY FRONTEND AND BACKEND */
wp_enqueue_script( 'require' );
wp_enqueue_style( 'vlib_bootstrap' );
wp_enqueue_style( 'vlib_bootstrap_theme' );
wp_enqueue_style( 'vlib_pageStyle', plugins_url( 'css/pageStyle.css' ) );
//wp_enqueue_script('vlib_jquery_ui');

/****************************************/

/****************************************/
/* GLOBAL DATA */
global $vlib_data;
$GLOBALS[ 'vlib_data' ] = array(
	'id' => -1,
	'adminUrl' => admin_url( 'admin.php' ),
	'basePath' => plugins_url( '', __FILE__ ) . "/",
	//'appPath' => "js/VLib_dist/"
	'appPath' => "js/VLib"
);
$GLOBALS[ 'vlib_data' ][ 'id' ] = $_GET[ 'id' ];
/****************************************/

/****************************************/
/* FRONTEND */
if ( !is_admin() ) {
	wp_register_script(
		'vlib_script_frontend',
		plugins_url( 'js/wp-frontend.js', __FILE__ ),
		array( "jquery" ),
		'1.2',
		true );
	wp_localize_script( 'vlib_script_frontend', 'vlib_', $GLOBALS[ 'vlib_data' ] );
	wp_enqueue_script( 'vlib_script_frontend' );

}
/****************************************/
function loadEditorCallback()
{
	wp_register_script(
		'vlib_script_editor',
		plugins_url( 'js/wp-editor.js', __FILE__ ),
		array( "jquery" ),
		'1.2',
		true );
	wp_localize_script( 'vlib_script_editor', 'vlib_', $GLOBALS[ 'vlib_data' ] );
	wp_enqueue_script( 'vlib_script_editor' );
}
function loadGroupEditorCallback(){
	wp_register_script(
		'vlib_script_bootstrap',
		plugins_url( 'js/VLib/libs/vendor/bootstrap/dist/js/bootstrap.min.js', __FILE__ ),
		array( "jquery" ),
		null,
		true );
	wp_enqueue_script( 'vlib_script_bootstrap' );
	wp_register_script(
		'vlib_script_group_editor',
		plugins_url( 'js/wp-group-editor.js', __FILE__ ),
		array( "jquery","jquery-ui-draggable","jquery-ui-droppable" ),
		'1.2',
		true );
	wp_localize_script( 'vlib_script_group_editor', 'vlib_', $GLOBALS[ 'vlib_data' ] );
	wp_enqueue_script( 'vlib_script_group_editor' );
}
function loadImportCallback()
{
	wp_register_script(
		'vlib_script_bootstrap',
		plugins_url( 'js/VLib/libs/vendor/bootstrap/dist/js/bootstrap.min.js', __FILE__ ),
		array( "jquery" ),
		null,
		true );
	wp_enqueue_script( 'vlib_script_bootstrap' );

	wp_register_script(
		'vlib_script_form_upload',
		plugins_url( 'js/jquery.form.min.js', __FILE__ ),
		null,
		true );
	wp_enqueue_script( 'vlib_script_form_upload' );

	wp_register_script(
		'vlib_script_file_upload',
		plugins_url( 'js/FileUpload.js', __FILE__ ),
		array( "jquery" ),
		null,
		true );
	wp_enqueue_script( 'vlib_script_file_upload' );

	wp_register_script(
		'vlib_script_file_upload_handle',
		plugins_url( 'js/FileUploadHandle.js', __FILE__ ),
		array( "jquery" ),
		null,
		true );
	wp_enqueue_script( 'vlib_script_file_upload_handle' );

	wp_register_script(
		'vlib_script_file_upload_html5_handle',
		plugins_url( 'js/FileUploadHTML5Handle.js', __FILE__ ),
		array( "jquery" ),
		null,
		true );
	wp_enqueue_script( 'vlib_script_file_upload_html5_handle' );

	wp_register_script(
		'vlib_script_import',
		plugins_url( 'js/wp-import.js', __FILE__ ),
		array( "jquery" ),
		null,
		true );
	wp_localize_script( 'vlib_script_import', 'vlib_', $GLOBALS[ 'vlib_data' ] );
	wp_enqueue_script( 'vlib_script_import' );
}

function create_page_main()
{
	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_main.php' );
	echo $content;
}

function create_page_editor()
{
	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_edit.php' );
	$content = str_replace( "###PATH###", $plugin_dir, $content );
	echo $content;
}
function create_page_group()
{
	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_group_editor.php' );
	$content = str_replace( "###WORDPRESS###", json_encode( $GLOBALS[ 'vlib_data' ] ), $content );
	echo $content;
}
function create_page_import()
{
	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_import.php' );
	//$content = str_replace("###WORDPRESS###", json_encode($GLOBALS['vlib_data']), $content );
	echo $content;
}

function create_page_group_list()
{
	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_group_list.php' );
	$content = str_replace( "###WORDPRESS###", json_encode( $GLOBALS[ 'vlib_data' ] ), $content );
	echo $content;
}

function create_page_file_list()
{
	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_file_list.php' );
	$content = str_replace( "###WORDPRESS###", json_encode( $GLOBALS[ 'vlib_data' ] ), $content );
	echo $content;
}

function create_page_plots()
{
	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_plot_list.php' );
	$content = str_replace( "###WORDPRESS###", json_encode( $GLOBALS[ 'vlib_data' ] ), $content );
	echo $content;
}

add_action( 'admin_menu', 'profileAddMenu' );
function profileAddMenu()
{
	add_menu_page( 'vPlot', 'vPlot', 10, __FILE__, 'create_page_main' );
	add_submenu_page( __FILE__, '', '', 10, __FILE__, '' );
	$editor_hook_suffix = add_submenu_page( __FILE__, 'Plot Editor', 'Plot Editor', 10, 'editor', 'create_page_editor' );
	$group_hook_suffix = add_submenu_page( __FILE__, 'Group Editor', 'Group Editor', 10, 'group', 'create_page_group' );
	$plots_hook_suffix = add_submenu_page( __FILE__, 'My Plots', 'My Plots', 10, 'plots', 'create_page_plots' );
	$groups_hook_suffix = add_submenu_page( __FILE__, 'My Groups', 'My Groups', 10, 'groups', 'create_page_group_list' );
	$files_hook_suffix = add_submenu_page( __FILE__, 'My Files', 'My Files', 10, 'files', 'create_page_file_list' );
	$import_hook_suffix = add_submenu_page( __FILE__, 'Import', 'Import', 10, 'import', 'create_page_import' );

	add_action( "load-{$editor_hook_suffix}", 'loadEditorCallback' );
	add_action( "load-{$group_hook_suffix}", 'loadGroupEditorCallback' );
	add_action( "load-{$import_hook_suffix}", 'loadImportCallback' );
}

global $vlib_db_version;

$vlib_db_version = "6.4.4";
update_option( "vlib_db_version", $vlib_db_version );
register_activation_hook( __FILE__, 'vlib_install' );

function vlib_install()
{
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	global $wpdb;
	global $charset_collate;
	global $vlib_db_version;
	if ( ! empty( $wpdb->charset ) ) {
		$charset_collate = "DEFAULT CHARACTER SET {$wpdb->charset}";
	}

	if ( ! empty( $wpdb->collate ) ) {
		$charset_collate .= " COLLATE {$wpdb->collate}";
	}
	/****************************************************************/
	/* TEMPLATES */
	$table_name = $wpdb->prefix . "vlib_templates";
	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
		template_name tinytext NOT NULL,
		template_description text NOT NULL,
		template_graph longtext NOT NULL,
		template_thumbnail longtext,
		UNIQUE KEY id (id)
		) $charset_collate;";
	dbDelta( $sql );
	/****************************************************************/
	/* PLACEHOLDER */
	$table_name = $wpdb->prefix . "vlib_placeholder";
	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		pattern tinytext NOT NULL,
		UNIQUE KEY id (id)
		) $charset_collate;";
	dbDelta( $sql );
	/****************************************************************/
	/* TEMPLATE_HAS_PLACEHOLDER */
	$table_name = $wpdb->prefix . "vlib_template_has_placeholder";
	$sql = "CREATE TABLE $table_name (
		template_id mediumint(9) NOT NULL,
		placeholder_id mediumint(9) NOT NULL
		) $charset_collate;";
	dbDelta( $sql );
	/****************************************************************/
	/* FILES */
	$table_name = $wpdb->prefix . "vlib_files";
	$sql = "CREATE TABLE $table_name (
	id mediumint(9) NOT NULL AUTO_INCREMENT,
	time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
	file_name tinytext NOT NULL,
	file_description text NOT NULL,
	full_file_name text NOT NULL,
	file_is_visible TINYINT(1) DEFAULT 0 NOT NULL,
	UNIQUE KEY id (id)
	) $charset_collate;";
	dbDelta( $sql );

	/****************************************************************/
	/* GROUPS */
	$table_name = $wpdb->prefix . "vlib_group";
	$sql = "CREATE TABLE $table_name (
	id INT NOT NULL AUTO_INCREMENT,
	time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
	name tinytext NOT NULL,
	description text NOT NULL,
	group_json text NOT NULL,
	UNIQUE KEY id (id ASC)
	) $charset_collate;";
	dbDelta( $sql );
	echo "ISNTALL version ".$vlib_db_version;
	add_option( "vlib_db_version", $vlib_db_version );
}

//shortcode plot
function get_shortcode_plot( $atts )
{
	$sc =  shortcode_atts( array(
		'id' => -1,
		'w' => '100%',
		'h' => '500px'
	), $atts );

	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_shortcode_plot.html' );
	$content = str_replace( "###WORDPRESS:ID###", $sc["id"], $content );
	$content = str_replace( "###WORDPRESS:WIDTH###", $sc["w"], $content );
	$content = str_replace( "###WORDPRESS:HEIGHT###", $sc["h"], $content );
	return $content;
}
//shortcode group
function get_shortcode_group( $atts )
{
	$sc =  shortcode_atts( array(
		'id' => -1,
		'w' => '100%',
		'h' => '500px'
	), $atts );

	$plugin_dir = plugin_dir_url( __FILE__ );
	$content = file_get_contents( $plugin_dir . 'wp_vlib_shortcode_group.html' );
	$content = str_replace( "###WORDPRESS:ID###", $sc["id"], $content );
	$content = str_replace( "###WORDPRESS:WIDTH###", $sc["w"], $content );
	$content = str_replace( "###WORDPRESS:HEIGHT###", $sc["h"], $content );
	return $content;
}

function register_shortcodes()
{
	add_shortcode( 'vPlot', 'get_shortcode_plot' );
	add_shortcode( 'vGroup', 'get_shortcode_group' );
}

add_action( 'init', 'register_shortcodes' );




?>
