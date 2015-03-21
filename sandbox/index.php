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
	case "settings":
		makeHeader(3);
		readfile("/pages/setting.html")
		makeFooter(3);
		break;
	case "deleteassignment":
		deleteAssignment($aid);
		goto a;
	case "addassignment":
		makeAssignment($aid);
		goto a;
	case "assignment":
		a:
		makeHeader(2);
		readfile("/pages/assignment.html")
		makeFooter(2);
		break;
	case "deleteclass":
		deleteAssignment($aid);
		goto c;
	case "addclass":
		makeClass($cid);
		goto c;
	case "class":
		c:
		makeHeader(1);
		readfile("/pages/class.html")
		makeFooter(1);
		break;
	case "home":
	default:
		makeHeader(0);
		readfile("/pages/index.html")
		makeFooter(0);
		break;
}
?>