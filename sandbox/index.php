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
$classId = $assignmentId = 0;
if($_SERVER["REQUEST_METHOD"] == "GET") 
{
	$action = isset($_GET["action"]) ? format($_GET["action"]) : "default";
	$action = strtolower($action);
	$classId = isset($_GET["cid"]) ? parse_int(format($_GET["cid"])) : -1;
	$assignmentId = isset($_GET["aid"]) ? parse_int(format($_GET["aid"])) : -1;
}

$page = "";
// display page
switch($action)
{
	case "options":
		$page .= printHeader(2);
		$page .= printFooter(2);
		break;
	case "list":
		$page .= printHeader(1);
		$page .= printFooter(1);
		break;
	case "home":
	default:
		$page .= printHeader(0);
		$page .= printFooter(0);
		break;
}

echo $page;
?>