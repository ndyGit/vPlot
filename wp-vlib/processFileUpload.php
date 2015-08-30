<?php
require_once("../../../wp-config.php");

require_once(ABSPATH . "wp-admin" . '/includes/image.php');
require_once(ABSPATH . "wp-admin" . '/includes/file.php');
require_once(ABSPATH . "wp-admin" . '/includes/media.php');

$table_name = $wpdb->prefix . "vlib_files";


$fileName = $_POST['ul-name'];
$fileDescription = $_POST['ul-description'];
$file = $_FILES['ul-file'];

$uploaddir = 'data/';
$uploadfile =  uniqid().'_'.basename($file['name']);

if (move_uploaded_file($file['tmp_name'], $uploaddir.$uploadfile)) {

			$name=$fileName;
			$descr=$fileDescription;
			$path= $uploadfile;

			$insert = "INSERT INTO " . $table_name .
						" (time, file_name, file_description, file_path, full_file_name) " .
						"VALUES (now(), '$name', '$descr', '$path', '$path' )";
			$results = $wpdb->query( $insert );

			if( $results !== 1)
				print "There has been an error saving the template. ".$insert;


} else {
    echo "Möglicherweise eine Dateiupload-Attacke!\n";
}

?>
