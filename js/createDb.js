/* 	createDb.js
	Creates database tables

	Revision history (if we need it)


*/

var db = openDatabase('weight2grade', '1.0', 'weight2grade db', 2*1024*1024);

db.transaction(function(tx) {
	tx.executeSql("CREATE TABLE IF NO EXISTS tblClass("
		+ "class_id INTEGER PRIMARY KEY,"
		+ "class_name VARCHAR(30),"
		+ "course_code VARCHAR(10),"
		+ "target_grade INTEGER(100)"
		+ "credits INTEGER(12))", null, success, fail);

<<<<<<< HEAD
	tx.executeSql("CREATE TABLE IF NOT EXISTS tblTasks(")
		+ "task_id INTEGER PRIMARY KEY,"
		+ "class_id INTEGER(10),"
		+ "task_type"
		+ "task_name VARCHAR(30),"
		+ "task_description VARCHAR(200),"
=======
	tx.executeSql("CREATE TABLE IF NOT EXISTS tblAssignments(")
		+ "assignment_id INTEGER PRIMARY KEY,"
		+ "class_id INTEGER(10),"
		+ "assignment_type"
		+ "assignment_name VARCHAR(30),"
		+ "assignment_description VARCHAR(200),"
>>>>>>> 38ee9e17ed7b04586d79fd8b03cf51a4a44e376b
		+ "target_grade INTEGER(100),"
		+ "weight INTEGER(3),"
		+ "weight_achieved INTEGER(3),"
		+ "is_bonus BOOLEAN,"
<<<<<<< HEAD
		+ "FOREIGN KEY(class_id) REFERENCES tblClass(class_id)", null, success, fail);
=======
		+ "FOREIGN KEY(class_id) REFeRENCES tblClass(class_id)", null, success, fail);
>>>>>>> 38ee9e17ed7b04586d79fd8b03cf51a4a44e376b
});

function success(tx, result)
{
	console.log(result);
}

function fail(tx, result)
{
	console.log("ERROR: " + result.message);
}