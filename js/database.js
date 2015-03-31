/*	database.js
	handles database transaction

	Revision history (if we need it)


*/

  ///////////////////////////////
 ////remember db is defined/////
///////////////////////////////

/*fail function is also defined in createdb.js.*/

//class functions
function get_listOfClasses()
{
	db.transaction(function(tx) {

	});
}

function add_Class(className, courseCode, targetGrade, credits)
{
	//validate first
}

function update_class()
{

}

function delete_class()
{

}

//task functions
function get_tasks()
{

}

function add_task(classId, assignmentType, assignmentName, assignmentDescription, targetGrade, weight, weightAchived, isBonus)
{
	//validate
}

function update_task()
{

}

function delete_task()
{

}