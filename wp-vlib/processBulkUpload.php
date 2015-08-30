<?php
require_once( "../../../wp-config.php" );
require_once( ABSPATH . "wp-admin" . '/includes/image.php' );
require_once( ABSPATH . "wp-admin" . '/includes/file.php' );
require_once( ABSPATH . "wp-admin" . '/includes/media.php' );
require_once( 'Query.php' );

$table_name = $wpdb->prefix . "vlib_files";

$fileName = basename( $_POST[ 'upload-form-name' ] );
$fileDescription = $_POST[ 'upload-form-description' ];
$createGroup = $_POST[ 'upload-form-create-group' ];
$createGroup = $createGroup === 'on' ? True : False;
$filesVisible = $_POST[ 'upload-form-file-visible' ];
$filesVisible = $filesVisible === 'on' ? True : False;
$PLOT_FILE_EXTENSION = 'vlib';
$files = $_FILES[ 'upload-form-input' ];
$dataFolder = "data/";
$rootFolder = 'data/groups/';
$groupName = uniqid( '_' .$fileName . '_' );
$uploaddir = $rootFolder . $groupName;



/* create subfolder if it does not exist */
if ( !is_dir( $uploaddir ) ) {
	mkdir( $uploaddir );
}

/* move uploaded files from tmp to destination */
for ( $i = 0; $i < count( $files[ 'name' ] ); $i++ ) {


	/* Get the tmp file path */
	$tmpFilePath = $files[ 'tmp_name' ][ $i ];
	if ( $tmpFilePath != "" ) {
		$newFilePath = $uploaddir ."/". $files[ 'name' ][ $i ];
		/* move */
		if ( move_uploaded_file( $tmpFilePath, $newFilePath ) ) {
			/* handle zip files */
			if ( isZip( $newFilePath ) ) {
				unzip( $newFilePath );
			}
		}
	}
}

/* GET FOLDERS */
$folders = getFolders( $uploaddir );
$group = getGroupFolder( $fileName, $fileDescription);
$files = getFiles( $uploaddir  );

/* DB - ADD FILES TO FOLDER */
foreach ( $files as $file ) {
	//echo "File: ".$file->getBasename()." in ".$file->getPath()."<br />";
	$fDescr = "Size: ".round($file->getSize()/1024,2)." Kb.";
	$baseFolder = str_replace ($uploaddir,"",$file->getPath());
	//echo "BASE: ".$baseFolder.' #### ';
	if($baseFolder[0] === DIRECTORY_SEPARATOR){
		$baseFolder = substr($baseFolder, 1);
	}
	if(strcmp($PLOT_FILE_EXTENSION,getExtension( $file )) === 0){
		$fd = file_get_contents($file->getPath()."/".$file->getBasename());
		$json = json_decode( $fd , true);

		$fileId = createTemplateQuery( $json["name"], $json["description"], json_encode($json["sceneGraph"]), $json['thumbnail'] );

		if($createGroup){
			$f = getGroupPlot( $file->getBasename(), $fDescr );
			$f[ "config" ][ "file" ] = array(
				"id" => $fileId,
				"name" => $json["name"],
				"description" => $json["description"]
			);
			groupAddFile($group,$baseFolder,$f);
		}
	}else{

		$fPath = strRemove($file->getPath()."/".$file->getBasename(),$dataFolder);
		//echo "PATH: ".$fPath.' ###### ';
		$fileId = createFileQuery( $file->getBasename(), $fDescr, $fPath, $filesVisible );
		if( $createGroup ) {
			$f = getGroupFile( $file->getBasename(), $fDescr );
			$f[ "config" ][ "file" ] = array(
				"id" => $fileId,
				"name" => $file->getBasename(),
				"description" => $fDescr,
				"path" => $fPath,
				"fullName" => $file->getBasename()
			);
			$p = getGroupPlot('plot','');
			$f["parentId"] = $p["id"];
			array_push($p['childs'],$f);
			groupAddFile( $group, $baseFolder, $p );
		}
	}
}

/* DB - CREATE GROUP */
if( $createGroup ) {
	$groupId = createGroupQuery( $fileName, $fileDescription, $group );
}
/* return group id  */
echo $groupId;

/*****************************************************************************/
/* FUNCTIONS */
function getFiles( $folder )
{
	$iter = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $folder),
		RecursiveIteratorIterator::SELF_FIRST,
		RecursiveIteratorIterator::CATCH_GET_CHILD // Ignore "Permission denied"
	);

	$data = null;
	foreach ( $iter as $path => $dir ) {
		if ( $dir->isFile() ) {
			if(mb_substr($dir->getBasename(), 0, 1, 'utf-8') == "."){
				continue;
			}
			$data[] = $dir;
		}
	}
	return $data;
}

function getFolders( $basePath )
{
	if ( !is_dir( $basePath ) ) {
		return array();
	}
	$root = $basePath;
	$iter = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $root ),
		RecursiveIteratorIterator::SELF_FIRST,
		RecursiveIteratorIterator::CATCH_GET_CHILD // Ignore "Permission denied"
	);

	$data = array();
	foreach ( $iter as $path => $dir ) {

		if ( $dir->isDir() ) {
			$data[ ] = str_replace( $root, "", $path );
		}
	}
	return $data;
}

function isZip( $file )
{
	$file_parts = pathinfo( realpath( $file ) );
	$extension = $file_parts[ 'extension' ];
	return strtolower( $extension ) === 'zip' ? true : false;
}

function unzip( $file )
{
	$path = pathinfo( realpath( $file ), PATHINFO_DIRNAME );
	if ( !path ) return false;

	$zip = new ZipArchive();
	$res = $zip->open( $file );
	if ( $res === true ) {
		$zip->extractTo( $path );
		$zip->close();
	} else {
		return false;
	}
	/* delete zip file */
	unlink( $file );
	return true;
}
/* GROUP ELEMENTS */
function getGroupElement(){
	return array(
		"id" => rand(0,100000),
		"type" => "folder",
		"parentId" => -1,
		"config" => array(
			"name" => "",
			"description" => "",
			"file" => false
		),
		"childs" => array()
	);
}
function getGroupFolder( $name, $description){
	$element = getGroupElement();
	$element["id"] = "folder-".$element["id"];
	$element["type"] = "folder";
	$element["config"]["name"] = $name;
	$element["config"]["description"] = $description;
	return $element;
}
function getGroupFile( $name, $description){
	$element = getGroupElement();
	$element["id"] = "file-".$element["id"];
	$element["type"] = "file";
	$element["config"]["name"] = $name;
	$element["config"]["description"] = $description;
	return $element;
}
function getGroupPlot( $name, $description){
	$element = getGroupElement();
	$element["id"] = "plot-".$element["id"];
	$element["type"] = "plot";
	$element["config"]["name"] = $name;
	$element["config"]["description"] = $description;
	return $element;
}

function groupAddFile(&$group, $folderPath, $file){

	$base =& $group;
	$tmp = null;
	/* ROOT */
	if($folderPath === ""){
		array_push($base["childs"],$file);
		return true;
	}

	$folders = explode(DIRECTORY_SEPARATOR,$folderPath);
	$index = 0;
	$length = count($folders);

	foreach($folders as $folder){
		$tmp =& getChildByName($base,$folder);
		if($tmp === null){
			$tmp = getGroupFolder($folder,"");
			$tmp["parentId"] = $base["id"];
			array_push($base["childs"],$tmp);
			$tmp =& getChildByName($base,$folder);
		}
		//echo "slected folder [ ".$tmp["config"]["name"]." ] ";
		if($index === $length -1){
			//echo "add file [ ".$file["config"]["name"]." ] to folder ".$tmp["config"]["name"]." ] ";
			$file["parentId"] = $tmp["id"];
			array_push($tmp["childs"],$file);
		}
		$base =& $tmp;
		$index++;
	}

	return true;

}
function &getChildByName( &$parent, $name){
	for( $i = 0; $i < count($parent["childs"]);++$i){
		//echo "i: ".$i." count(".count($parent["childs"]). ") compare: ".$parent["childs"][$i]["config"]["name"]." === ".$name."<br />";
		if(strcmp($parent["childs"][$i]["config"]["name"],$name) === 0){
			return $parent["childs"][$i];
		}
	}
	return null;
}

function getExtension( $file ){
	return pathinfo($file->getFilename(), PATHINFO_EXTENSION);
}

function strRemove($haystack,$needle){
	$pos = strpos($haystack,$needle);
	if ($pos !== false) {
		$newstring = substr_replace($haystack,'',$pos,strlen($needle));
	}
	return $newstring;
}


