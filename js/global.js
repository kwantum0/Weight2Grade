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
	var page = location.hash;
	switch(page)
	{
		//{ Class List View
		case "#homeView":
			setClassId(-1);
			setAssId(-1);
			populateClassList();
			break;
		//}
		case "#classView":
			setAssId(-1);
			displayClass();
			break;
		case "#assView":
			break;
		default:
			break;
	}
});

//{ Shared Callback
function moreClassInfo(item, isLast, fn) {
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
		if(isLast){
			refreshLists();
		}
	};
}//}

//{ Action that populates the class list
function populateClassList() {
	// reset the class list
	$('#classList li:not(:first):not(:last):not(.addClassForm)').remove();
	// iterate over each class item through callback
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
		dbGetClassInfo(id, moreClassInfo(r, i >= rs.length - 1, buildClassListItem));
	}
}
function buildClassListItem(item, total, weight, achieved, lost, comp){
	// convert weight to percentages
	achieved = (weight <= 0 ? 0 : Math.ceil(achieved / weight * 100));
	lost	 = (lost <= 0 ? 0 : Math.floor(lost / weight * 100));
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
	$('div#classView section li:not(.taskForm):not(.taskFormBtn)').remove();
	// get the class item through callback
	tblClassRead(classCurry);
}
//{ Display Class dependences
function classCurry(tx, res) {
	// get the record and id from the record set
	var r = res.rows.item(0);
	var id = r.class_id;
	dbGetClassInfo(id, moreClassInfo(r, true, buildClassHeader));
}
function buildClassHeader(item, total, weight, achieved, lost, comp){
	// convert weight to percentages
	achieved = (weight <= 0 ? 0 : Math.ceil(achieved / weight * 100));
	lost	 = (lost <= 0 ? 0 : Math.floor(lost / weight * 100));
	// build the element
	var ul = '<ul data-role="listview" class="hasBadges addToHead" data-split-icon="edit">'
		   + '<li data-icon="false"><a href="#classView" class="ui-link-inherit" onclick="setClassId(' + item.class_id + ');">'
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
		   +		'<div style="width: 0%; display: none" role="progressbar" class="progress-bar progress-bar-warning hoverGrade">'
		   +			0
		   +		'</div>'
		   +		'<div style="float: right; width: '+ lost +'%" role="progressbar" class="progress-bar progress-bar-danger">'
		   +			lost
		   +		'</div>'
		   +	'</div>'
		   + '</div></a><a href="#editView" data-rel="popup" data-position-to="window" data-transition="pop">Edit Class</a></li></ul>';
	// add the element to the page
	$("div#classView section").prepend(ul);
}//}
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

//{ Assignment Item Hover Events
$("#outstandingAssList > li > a").hover(function() {
	pumpCircle($(this).find(".circle"));
}, function(){
	deflateCircle($(this).find(".circle"));
});
$("#completedAssList > li > a").hover(function() {
	pumpCircle($(this).find(".circle"));
}, function(){
	deflateCircle($(this).find(".circle"));
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

