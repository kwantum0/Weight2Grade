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

	tx.executeSql("CREATE TABLE IF NOT EXISTS tblAssignments(")
		+ "assignment_id INTEGER PRIMARY KEY,"
		+ "class_id INTEGER(10),"
		+ "assignment_type"
		+ "assignment_name VARCHAR(30),"
		+ "assignment_description VARCHAR(200),"
		+ "target_grade INTEGER(100),"
		+ "weight INTEGER(3),"
		+ "weight_achieved INTEGER(3),"
		+ "is_bonus BOOLEAN,"
		+ "FOREIGN KEY(class_id) REFeRENCES tblClass(class_id)", null, success, fail);
});

function success(tx, result)
{
	console.log(result);
}

function fail(tx, result)
{
	console.log("ERROR: " + result.message);
}