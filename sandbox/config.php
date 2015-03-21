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

function makeHeader($actNumb)
{
	
}

function makeFooter($actNumb)
{
	
}
?>