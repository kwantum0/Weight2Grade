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