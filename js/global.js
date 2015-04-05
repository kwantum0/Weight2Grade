/*	global.js
	runs on the initial set-up and binds event handlers

	Revision history
		Daniel Franz	 2015.04.01: created
*/

/****************************
 *		DOCUMENT READY		*
 ****************************/
$(document).ready(function() {	
	//{ DATABASE
	// check if setup is complete
	var setup_complete = localStorage.getItem("setup");
	if(setup_complete == null || setup_complete != "COMPLETE")
	{
		// drop all data, it might be corrupt
		dbDropTables();
		
		// create the tables
		dbCreateTables();
		
		// populate the type table
		tblTypePopulate();
		
		// reset default pass grade to 55
		localStorage.setItem("defaultPassGrade", "55");
		
		// reset IDs
		setClassId(-1);
		setAssId(-1);
		
		// set setup as COMPLETE
		localStorage.setItem("setup", "COMPLETE");
	}
	//}
});

/****************************
 *		  CONTROLLER		*
 ****************************/
// Controller for navigation events
$(window).on("pagebeforeshow", function() {
	// actions that always happen
	refreshValidation();
	// actions that only happen on certain pages
	var page = location.hash;
	switch(page){
		case "":
		case "#homeView":
			populateClassList();
			break;
		case "#classView":
			displayClass();
			populateTypeList();
			populateAssList();
			break;
		case "#assView":
			break;
		default:
			$.mobile.changePage("index.html#homeView");
			break;
	}
});


//{ Shared Callback
function moreClassInfo(item, fn) {
	return function(tx, res) {
		var rs = res.rows;
		var total = 0;
		var weight = 0;
		var achieved = 0;
		var lost = 0;
		var comp = 0;
		for(var i = 0; i < rs.length; i++){
			var r = rs.item(i);
			if(r.state == "COMP"){
				comp += r.Ass_Count;
			}
			if(r.state == "MARK"){
				comp += r.Ass_Count;
				achieved += r.Achieved_Weight;
				lost += r.Lost_Weight;
			}
			weight += r.Total_Weight;
			total += r.Ass_Count;
		}
		fn(item, total, weight, achieved, lost, comp);
	};
}//}

//{ Action that populates the select dropdown
function populateTypeList() {
	// reset the type list
	$('#addAssType').empty();
	// iterate over each item in callback
	tblTypeList(typeListIterate);
}
// { Populate Type List dependences
function typeListIterate(tx, res) {
	var rs = res.rows;
	for(var i = 0; i < rs.length; i++){
		var name = rs.item(i).type_name;
		var opt = '<option value="' + name + '" ' 
				+ (i == 0 ? 'selected' : '') + '>' 
				+ name + '</option>';
		$('#addAssType').append(opt);
	}
	$('#addAssType').selectmenu( "refresh" );
}//}
//}	
	
//{ Action that populates the class list
function populateClassList() {
	// reset the class list
	$('#classList li:not(:first):not(:last):not(.addClassForm)').remove();
	// iterate over each item in callback
	tblClassList(classListIterate);
}
//{ Populate Class List dependences
function classListIterate(tx, res) {
	var rs = res.rows;
	for(var i = 0; i < rs.length; i++){
		// get the record and id, from the record set
		var r = rs.item(i);
		var id = r.class_id;
		// get more class information through callback
		dbGetClassInfo(id, moreClassInfo(r, buildClassListItem));
	}
}
function buildClassListItem(item, total, weight, achieved, lost, comp){
	// convert weight to percentages
	achieved = (weight <= 0 ? 0 : Math.ceil(achieved / weight * 100));
	lost	 = (weight <= 0 ? 0 : Math.floor(lost / weight * 100));
	// build the element
	var li = '<li data-icon="false"><a href="#classView" class="ui-link-inherit" onclick="setClassId(' + item.class_id + ');">'
		   + 	'<h2>' + item.class_code + '</h2><p>' + item.class_description + '</p>'
		   + 	'<p class="ui-li-aside">' + comp.toString() + ' / ' + total.toString() + '</p>'
		   + '<div class="progress-wrapper">'
		   + 	'<div class="badge-box" style="padding-left: 0px">'
		   + 		'<div class="carat-up"></div>'
		   +		'<span class="badge">' + item.pass_grade + '</span>'
		   +	'</div>'
		   + 	'<div class="badge-box" style="padding-left: 0px">'
		   +		'<div class="carat-up carat-up-success"></div>'
		   + 		'<span class="badge badge-success" >' + item.target_grade + '</span>'
		   + 	'</div>'
		   + 	'<div class="progress">'
		   + 		'<div style=" width: '+ achieved +'%" role="progressbar" class="progress-bar progress-bar-default">'
		   + 			achieved 
		   +		'</div>'
		   +		'<div style="float: right; width: '+ lost +'%" role="progressbar" class="progress-bar progress-bar-danger">'
		   +			lost
		   +		'</div>'
		   +	'</div>'
		   + '</div></a></li>';
	// add the element to the page
	$(li).insertAfter("#insertClass");
	refreshLists();
}//}
//}

//{ Action that adds a new class
function handleAddClassForm() {
	if($("#classAdd").valid()) {
		var code = $("#addClassCode").val().trim();
		var desc = $("#addClassDesc").val().trim();
		var target = $("#addClassGoal").val();
		
		tblClassInsert(code, desc, target, addClassSuccess, addClassFail);
	}
}
//{ Add Class dependences
function addClassSuccess(tx, result) {
	var id = result.rows.item(0).id;
	setClassId(id);
	$.mobile.changePage("#classView");
	$('#classAdd').trigger("reset");
	toggleAddForm();
}
function addClassFail(tx, result) {
	alert("There was a problem adding the class.\nERROR MESSAGE: " + result.message);
}//}
//}
 
//{ Action that displays a class
function displayClass() {
	// reset all the lists
	$('.hasBadges.addToHead').remove();
	// get the class item through callback
	tblClassRead(classCurry);
}
//{ Display Class dependences
function classCurry(tx, res) {
	// get the record and id from the record set
	var r = res.rows.item(0);
	var id = r.class_id;
	dbGetClassInfo(id, moreClassInfo(r, buildClassHeader));
}
function buildClassHeader(item, total, weight, achieved, lost, comp){
	// convert weight to percentages
	achieved = (weight <= 0 ? 0 : Math.ceil(achieved / weight * 100));
	lost	 = (weight <= 0 ? 0 : Math.floor(lost / weight * 100));
	achieved = Math.min(achieved, 100);
	lost = Math.min(lost, 100 - achieved);
	// build the element
	var ul = '<ul data-role="listview" class="hasBadges addToHead" data-split-icon="edit">'
		   + '<li data-icon="false"><a href="#classView" class="ui-link-inherit" style="pointer-events:none">'
		   + 	'<h2>' + item.class_code + '</h2><p>' + item.class_description + '</p>'
		   + 	'<p class="ui-li-aside">' + comp.toString() + ' / ' + total.toString() + '</p>'
		   + '<div class="progress-wrapper">'
		   + 	'<div class="badge-box" style="padding-left: 0px">'
		   + 		'<div class="carat-up"></div>'
		   +		'<span class="badge">' + item.pass_grade + '</span>'
		   +	'</div>'
		   + 	'<div class="badge-box" style="padding-left: 0px">'
		   +		'<div class="carat-up carat-up-success"></div>'
		   + 		'<span class="badge badge-success" >' + item.target_grade + '</span>'
		   + 	'</div>'
		   + 	'<div class="progress" data-total-weight="' + weight +'" id="bar">'
		   + 		'<div style=" width: '+ achieved +'%" role="progressbar" class="progress-bar progress-bar-default">'
		   + 			achieved 
		   +		'</div>'
		   +		'<div style="height:20px;margin-left:' + achieved + '%;position:absolute;width: 0%; display: none" role="progressbar" class="progress-bar progress-bar-warning hoverGrade">'
		   +			0
		   +		'</div>'
		   +		'<div style="float: right; width: '+ lost +'%" role="progressbar" class="progress-bar progress-bar-danger">'
		   +			lost
		   +		'</div>'
		   +	'</div>'
		   + '</div><h3 style="margin-left: 30px;"><span class="small">&Sigma; Weight:</span>' + weight + '</h3>'
		   + '</a><a href="#editView" data-rel="popup" data-position-to="window" data-transition="pop">Edit Class</a></li></ul>';
	// add the element to the page
	$("div#classView section").prepend(ul);
	refreshLists();
	
	// change the defaults in the edit Form
	$("#editClassCode").val(item.class_code);
	$("#editClassDesc").val(item.class_description);
	$("#editClassGoal").val(item.target_grade);
	$("#editClassPass").val(item.pass_grade);
	$('#editClassGoal, #editClassPass').slider("refresh");
	
}//}
//}

//{ Action that adds a new assignment
function handleAddAssForm() {
	if($("#assAdd").valid()) {
		var type = $("#addAssType").val();
		var name = $("#addAssName").val().trim();
		var desc = $("#addAssDesc").val().trim();
		var bonus = $("#addAssBonus").val() === 'true';
		var due = $("#addAssDate").val();
		var weight = $("#addAssWeight").val();
		
		tblAssignmentInsert(type, name, desc, due, weight, bonus, addAssSuccess, addAssFail);
	}
}
//{ Add Ass dependences
function addAssSuccess(tx, result) {
	var id = result.rows.item(0).id;
	setAssId(id);
	$('#assAdd').trigger("reset");
	toggleTaskForm();
	$.mobile.changePage("index.html#assView");
}
function addAssFail(tx, result) {
	alert("There was a problem adding the assignment.\nERROR MESSAGE: " + result.message);
}//}
//}

//{ Action that populate the assignment lists
function populateAssList() {
	// empty out the lists
	$("#markedAssList").empty();
	$("#completedAssList").empty();
	$("#outstandingAssList").empty();
	// iterate over each item in a callback
	tblAssignmentList(assListIterate);
}
// { Populate Ass List dependences 
function assListIterate(tx, res) {
	var rs = res.rows;
	for(var i = 0; i < rs.length; i++){
		// get the record and state
		var r = rs.item(i);
		var weight = parseFloat(r.weight_achieved);
		weight = isNaN(weight) ? 0 : weight;
		// build the date string
		var isOut = r.state == 'OUTS';
		var dateDue = new Date(r.date_due);
		dateDue = new Date(dateDue.getTimezoneOffset()*60000 + dateDue.getTime());
		var dateSub = new Date(r.date_submitted);
		dateSub = new Date(dateSub.getTimezoneOffset()*60000 + dateSub.getTime());
		var onTime = dateDue.getTime() >= dateSub.getTime();
		var date = isOut ? dateDue.toDateString() : dateSub.toDateString();
		var color = onTime ? 'style="color:#808080;text-shadow:1px 1px 0px #fff"' : 'style="color:#A55956;text-shadow:1px 1px 0px #fff"';
		// build the element
		var li = '<li><a href="#assView" class="ui-link-inherit" onclick="setAssId(' + r.ass_id + ');">'
			   + 	'<div class="circle" data-value="' + weight + '" data-weight="' + r.weight_total + '">'
			   +		'<strong></strong>'
			   +	'</div>'
			   +	'<h2>' + r.ass_name + '</h2><p>' + r.ass_description + '</p>'
			   +	'<p class="ui-li-aside"' + color + '>' + date + '</p>'
			   +	'<strong><span>&#215;</span>' + r.weight_total + '</strong>'
			   +	'</a></li>';
		// place element in the right list
		if(r.state == "MARK"){
			$("#markedAssList").append(li);
		}else if(r.state == "COMP"){
			$("#completedAssList").append(li);
		}else{
			$("#outstandingAssList").append(li);
		}
	}
	refreshLists();
}//}
//}

//{ Action that edits a class
function handleEditClassForm() {
	if($("#classEdit").valid()) {
		var code = $("#editClassCode").val().trim();
		var desc = $("#editClassDesc").val().trim();
		var target = $("#editClassGoal").val();
		var pass = $("#editClassPass").val();
		
		tblClassUpdate(code, desc, pass, target, editClassSuccess, editClassFail);
	}
}
//{ Edit Class dependences
function editClassSuccess(tx, result) {
	$.mobile.changePage("index.html#homeView");
}
function editClassFail(tx, result) {
	alert("There was a problem modifying the class. \nERROR MESSAGE: " + result.message);
}//}
//}

//{ Action that deletes a class
function handleDeleteClassForm() {
	var result = confirm("You are about to permanently delete this Class along with all it's assignments.\n\nContinue?");
	if(result) {
		tblClassDelete(deleteClassSuccess, deleteClassFail);
	}
}
function deleteClassSuccess(tx, result) {
	$.mobile.changePage("index.html#homeView");
}
function deleteClassFail(tx, result) {
	alert("There was a problem deleting the class. \nERROR MESSAGE: " + result.message);
}
//}
/****************************
 *	 	EVENT BINDINGS		*
 ****************************/

//{ Clear Data Event
$("#resetData").on( "click", function() {
	var result = confirm("You are about to reset all your Weight2Grade data." 
						 + "There is no way to undo this change.\n\nContinue?");
	if(result){
		// set setup as RESET
		localStorage.setItem("setup", "RESET");
		parent.window.location.href = "index.html";
	}
});
//}

//{ Window Resize Event
var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(resetBadges, 500);
};
//}

//{ Page Show Events
$(window).on("pageshow", resetBadges);
$(window).on("pageshow", revealCircles);
//}

//{ Assignment List Expand Event
$(document).on("collapsibleexpand", function() {
	var str = $("#taskToggle").text();
	if(str == "Cancel"){
		toggleTaskForm();
	}
	$(".circle").circleProgress("redraw");
});
//}

//{ Garbage?
/*$("#markedAssList > li > a").hover(function() {
	// on enter
	$("#hoverGrade2").show();
	var weight = parseInt($(this).find(".circle").attr('data-weight'));
	var total = parseInt($("#bar").attr('data-total-weight'));
	var percent = weight / total * 100;
	$("#hoverGrade").width(percent.toString() + "%");
}, function() {
	// on leave
	$("#hoverGrade2").hide();
	$("#hoverGrade2").text("");
	$("#hoverGrade2").width(0);
});*/
//}

