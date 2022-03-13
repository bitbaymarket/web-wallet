<?php
$domain = "http://195.181.242.206:9998/api?";
$url = $domain . ($_SERVER['QUERY_STRING']);
$page = file_get_contents($url);

header("HTTP/1.1 200 OK");
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  
header("Access-Control-Allow-Methods: PUT, PATCH, GET, POST, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
echo $page;
