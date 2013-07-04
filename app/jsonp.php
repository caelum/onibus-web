<?php
	header("Content-type: application/javascript; charset=UTF-8");
  header("Cache-Control: public; max-age=60");

	$url = $_GET[url];
	$callback = $_GET[callback];
	$params = $_SERVER['QUERY_STRING'];

	$json = file_get_contents("$url?$params");
	echo "$callback($json)";
?>
