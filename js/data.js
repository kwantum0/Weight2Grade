/*	database.js
	handles all database transactions

	Revision history
		Chris Mosey		 2015.03.31: created
		Daniel Franz	 2015.04.01: combined database & createDb
*/

/****************************
 *		DATABASE SETUP		*
 ****************************/
var db = openDatabase('weight2grade', '1.0', 'weight2grade db', 2*1024*1024);

function dbCreateTables() {
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS tblClass("
			+ "class_id INTEGER PRIMARY KEY,"
			+ "class_code VARCHAR(30),"
			+ "class_description VARCHAR(250),"
			+ "pass_grade INTEGER,"
			+ "target_grade INTEGER)", null, success, fail);
		tx.executeSql("CREATE TABLE IF NOT EXISTS tblType("
			+ "type_id INTEGER PRIMARY KEY,"
			+ "type_name VARCHAR(15))", null, success, fail);
		tx.executeSql("CREATE TABLE IF NOT EXISTS tblAssignments("
			+ "assignment_id INTEGER PRIMARY KEY,"
			+ "class_id INTEGER,"
			+ "type_id INTEGER,"
			+ "assignment_name VARCHAR(30),"
			+ "assignment_description VARCHAR(250),"
			+ "weight INTEGER,"
			+ "weight_achieved INTEGER,"
			+ "is_bonus BOOLEAN,"
			+ "FOREIGN KEY(class_id) REFERENCES tblClass(class_id))", null, success, fail);
	});
}

function success(tx, result)
{
	console.log(result);
}

function fail(tx, result)
{
	console.log("ERROR: " + result.message);
}

//class functions
function get_listOfClasses()
{
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM tblClass",
			function(tx, result){
				//call function that takes result.rows as argument
			}, fail);
	});
}

function add_Class(className, courseCode, targetGrade, credits)
{
	//validate first
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO tblClass(class_name, course_code, target_grade, credits)"
			+ "VALUES (?, ?, ?, ?"[className, courseCode, targetGrade, credits], 
				function(tx, result){
					alert(className + " Added!");
				});
	})
}

function update_class(classId, className, couseCode, targetGrade, credits)
{
	//validate
	db.transaction(function(tx) {
		tx.executeSql("UPDATE tblClass "
			+ "SET class_name = ?, course_code = ?, target_grade = ?, credits = ?"
			+ "WHERE class_id = ?"[className, courseCode, targetGrade, credits, classId], 
			function(tx, result){
				alert("Class Updated!");
			}, fail);
	});
}

function delete_class(classId)
{
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM tblClass WHERE id=?", [classId],
			function(tx, result){
				alert("Class Deleted!");
			});
	});
}

//task functions
function get_tasks()
{
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM tblTasks",
			function(tx, result){
				//call function that takes result.rows as argument
			}, fail);
	});
}

function add_task(classId, assignmentType, assignmentName, assignmentDescription, targetGrade, weight, weightAchived, isBonus)
{
	//validate
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO tblTasks(class_id, task_type, task_name, task_description, target_grade, weight, weight_achived, is_bonus)"
			+ "VALUES(?, ?, ?, ?, ?, ?, ?, ?)",[classId, assignmentType, assignmentName, assignmentDescription, targetGrade, weight, weightAchived, isBonus],
			function(tx, result){
				alert(assignmentName + " Added!");
			}, fail);
	});
}

function update_task()
{
	//validate
	db.transaction(function(tx){
		tx.executeSql("UPDATE tblTasks"
			+ "SET class_id = ?, task_type = ?, task_name = ?, task_description = ?, target_grade = ?, weight = ?, weight_achived = ?, is_bonus = ?"
			+ "WHERE task_id = ?", [classId, assignmentType, assignmentName, assignmentDescription, targetGrade, weight, weightAchived, isBonus, taskId],
			function(tx, result){
				alert("Class Updated!");
			}, fail);
	});
}

function delete_task(taskId)
{
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM tblTasks WHERE id=?", [taskId],
			function(tx, result){
				alert("Task Deleted!");
			});
	});
}