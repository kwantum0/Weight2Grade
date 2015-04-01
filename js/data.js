/*	database.js
	handles all database transactions

	Revision history
		Chris Mosey		 2015.03.31: created
		Daniel Franz	 2015.04.01: combined database & createDb
*/

/****************************
 *	   GLOBAL VARIABLES 	*
 ****************************/
var db = openDatabase('weight2grade', '1.0', 'weight2grade db', 2*1024*1024);
var initialTypes = ['Lab','Project','Assignment','Exam','Quiz'];
	
/****************************
 *		DATABASE SETUP		*
 ****************************/
function dbCreateTables() {
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS tblClass("
			+ "class_id INTEGER PRIMARY KEY AUTOINCREMENT,"
			+ "class_code VARCHAR(30),"
			+ "class_description VARCHAR(250),"
			+ "pass_grade INTEGER,"
			+ "target_grade INTEGER)", null, success, fail);
		tx.executeSql("CREATE TABLE IF NOT EXISTS tblType("
			+ "type_name VARCHAR(15) PRIMARY KEY)", null, success, fail);
		tx.executeSql("CREATE TABLE IF NOT EXISTS tblAssignment("
			+ "assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,"
			+ "class_id INTEGER,"
			+ "type_name VARCHAR(15),"
			+ "assignment_name VARCHAR(30),"
			+ "assignment_description VARCHAR(250),"
			+ "date_due INTEGER,"
			+ "date_submited INTEGER,"
			+ "weight INTEGER,"
			+ "weight_achieved INTEGER,"
			+ "is_bonus BOOLEAN,"
			+ "FOREIGN KEY(class_id) REFERENCES tblClass(class_id),"
			+ "FOREIGN KEY(type_name) REFERENCES tblType(type_name))", null, success, fail);
	});
}
function tblTypePopulate() {
	for(i = 0; i < initialTypes.length; i++) {
		tblTypeInsert(initialTypes[i]);
	}
}

/****************************
 *		CLEAR DATABASE		*
 ****************************/
function dbDropTables() {
	db.transaction(function(tx) {
		tx.executeSql("DROP TABLE IF EXISTS tblClass;", null, success, fail);
		tx.executeSql("DROP TABLE IF EXISTS tblType;", null, success, fail);
		tx.executeSql("DROP TABLE IF EXISTS tblAssignment;", null, success, fail);
	});
}

/****************************
 *		 CRUD ACTIONS		*
 ****************************/
function tblTypeInsert(strName) {
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO tblType (type_name) VALUES ('" + strName + "');", null, success, fail);
	});
}
function tblTypeDelete(strName) {
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM tblType WHERE type_name = '" + strName + "';", null, success, fail);
	});
}
/****************************
 *	  		DEBUG			*
 ****************************/
function success(tx, result){
	console.log("SUCCESS: ");
	console.log(result);
	console.log("\n");
}

function fail(tx, result){
	console.log("ERROR: ");
	console.log(result);
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