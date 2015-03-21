<?php
/* index.php
 * controller for the web application
 * 
 * @author 	Daniel Franz <kwantum0@gmail.com>
 * @date 	March 21, 2015
 * @project	PROG3180 - Sec3 final project
 */

// get defaults 
require_once('config.php');

// get user action
$action = "";
$cid, $aid = 0;
if($_SERVER["REQUEST_METHOD"] == "GET") 
{
	$action = format($_GET["action"]);
	$action = strtolower($action);
	$cid = parse_int(format($_GET["cid"]));
	$aid = parse_int(format($_GET["aid"]));
}

// display page
switch($action)
{
	case "options":
		printHeader(2);
		printFooter(2);
		break;
	case "list":
		printHeader(1);
		printFooter(1);
		break;
	case "home":
	default:
		printHeader(0);
		printFooter(0);
		break;
}
?>