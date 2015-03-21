<?php
/* config.php
 * contains defaults and global constants for the application
 * 
 * @author 	Daniel Franz <kwantum0@gmail.com>
 * @date 	March 21, 2015
 * @project	PROG3180 - Sec3 final project
 */

 
/*******************************
 *	FORM VALIDATION FUNCTIONS  *
 *******************************/
function format($data)
{
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
function parse_int($data)
{
	$result = inval($data)
	return $result;
}

/****************************
 *	VIEW BUILDER FUNCTIONS	*
 ****************************/
function printFileStart()
{
	echo "<!DOCTYPE HTML>";
	echo "<html lang=\"en\">";
	echo "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\" />";
	echo "<title>Weight2Grade App</title>";
	echo ""
}
function makeHeader($actNumb)
{
	printFileStart();
	printDependancies();
	echo
	"<div data-role=\"header\" style=\"overflow:hidden;\" data-theme=\"a\">
		<h1>Weight2Grade</h1>
		<a href=\"#\" data-icon=\"gear\"  class=\"ui-btn-left\">Options</a>
		<div data-role=\"navbar\">
			<ul>
				<li><a href=\"#\">One</a></li>
				<li><a href=\"#\">Two</a></li>
				<li><a href=\"#\">Three</a></li>
			</ul>
		</div><!-- /navbar -->
	</div><!-- /header -->"
}

function makeFooter($actNumb)
{
	
}
?>