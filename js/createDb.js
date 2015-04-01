/* 	createDb.js
	Creates database tables

	Revision history (if we need it)


*/

var db = openDatabase('weight2grade', '1.0', 'weight2grade db', 2*1024*1024);

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

function success(tx, result)
{
	console.log(result);
}

function fail(tx, result)
{
	console.log("ERROR: " + result.message);
}