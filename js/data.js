/*	database.js
	handles all database transactions

	Revision history
		Chris Mosey		 2015.03.31: created
		Daniel Franz	 2015.04.01: combined database & createDb
*/

/****************************
 *	   GLOBAL VARIABLES 	*
 ****************************/
//{ Global Variables
var db = openDatabase('weight2grade', '1.0', 'weight2grade db', 2*1024*1024);
var initialTypes = ['Lab','Project','Assignment','Exam','Quiz','Other'];
//}

/****************************
 *		GLOBAL METHODS		*
 ****************************/
//{ Set Up 
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
			+ "ass_id INTEGER PRIMARY KEY AUTOINCREMENT,"
			+ "class_id INTEGER,"
			+ "type_name VARCHAR(15),"
			+ "ass_name VARCHAR(30),"
			+ "ass_description VARCHAR(250),"
			+ "date_due INTEGER,"
			+ "date_submitted INTEGER,"
			+ "weight_total INTEGER,"
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
} //}

//{ Take Down
function dbDropTables() {
	db.transaction(function(tx) {
		tx.executeSql("DROP TABLE IF EXISTS tblClass;", null, success, fail);
		tx.executeSql("DROP TABLE IF EXISTS tblType;", null, success, fail);
		tx.executeSql("DROP TABLE IF EXISTS tblAssignment;", null, success, fail);
	});
} //}

/****************************
 *		 CRUD ACTIONS		*
 ****************************/
//{ Type Table
function tblTypeInsert(strName) {
	strName = typeFormat(strName);
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO tblType (type_name) VALUES (?);", [strName], success, fail);
	});
}
function tblTypeDelete(strName) {
	strName = typeFormat(strName);
	if(strName != "Other"){
		db.transaction(function(tx) {
			tx.executeSql("UPDATE tblAssignment SET type_name = 'Other'"
						  + " WHERE type_name = ?;", [strName], success, fail);
			tx.executeSql("DELETE FROM tblType WHERE type_name = ?;", [strName], success, fail);
		});
	}
}
function tblTypeList(callbackFunc) {
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM tblType;", null, callbackFunc, fail); 
	});
}//}

//{ Class Table
function tblClassInsert(code, desc, target, onSuccess, onFail) {
	var pass = localStorage.getItem("defaultPassGrade");
	var sql = "INSERT INTO tblClass"
			+ " (class_code, class_description, pass_grade, target_grade)"
			+ " VALUES (?, ?, ?, ?);";
	db.transaction(function(tx) {
		tx.executeSql(sql, [code, desc, pass, target], onSuccess, onFail);
	});
}
function tblClassUpdate(code, desc, pass, target, onSuccess, onFail) {
	var id = localStorage.getItem("classID");
	var sql = "UPDATE tblClass SET class_code = ?, class_description = ?,"
			+ " pass_grade = ?, target_grade = ? WHERE class_id = ?;";
	db.transaction(function(tx) {
		tx.executeSql(sql, [code, desc, pass, target, id], onSuccess, onFail);
	});
}
function tblClassDelete(onSuccess, onFail) {
	var id = localStorage.getItem("classID");
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM tblAssignment WHERE class_id = ?;", [id], success, fail);
		tx.executeSql("DELETE FROM tblClass WHERE class_id = ?;", [id], onSuccess, onFail);
	});
}
function tblClassList(callbackFunc) {
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM tblClass;", null, callbackFunc, fail);
	});
} //}

//{ Assignment Table
function tblAssignmentInsert(type, name, desc, due, weight, bonus, onSuccess, onFail) {
	var classId = localStorage.getItem("classID");
	var sql = "INSERT INTO tblAssignment"
			+ " (class_id, type_name, ass_name, ass_description, date_due, weight_total, is_bonus)" 
			+ " VALUES (?, ?, ?, ?, ?, ?, ?);";
	db.transaction(function(tx) {
		tx.executeSql(sql, [classId, type, name, desc, due, weight, bonus], onSuccess, onFail);
	});
}
function tblAssignmentUpdate(type, name, desc, due, submit, weight, achieved, bonus, onSuccess, onFail) {
	var classId = localStorage.getItem("classID");
	var assId = localStorage.getItem("assignmentID");
	var sql = "UPDATE tblAssignment SET class_id = ?, type_name = ?, ass_name = ?,"
			+ " ass_description = ?, date_due = ?, date_submitted = ?, weight_total = ?,"
			+ " weight_achieved = ?, is_bonus = ? WHERE ass_id = ?;";
	db.transaction(function(tx) {
		tx.executeSql(sql, [classId, type, name, desc, due, submit, weight, achieved, bonus, assId], onSuccess, onFail);
	});
} 
function tblAssignmentDelete(onSuccess, onFail) {
	var id = localStorage.getItem("assignmentID");
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM tblAssignment WHERE ass_id = ?;", [id], onSuccess, onFail);
	});
}
function tblAssignmentList(callbackFunc) {
	var classId = localStorage.getItem("classID");
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM tblAssignment WHERE class_id = ?;", [classId], callbackFunc, fail);
	});
}//}

/****************************
 *	  		DEBUG			*
 ****************************/
//{ Logging Callback Functions
function success(tx, result){
	console.log("SUCCESS: ");
	console.log(result);
	console.log("\n");
}
function fail(tx, result){
	console.log("ERROR: ");
	console.log(result);
}//}