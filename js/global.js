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
		localStorage.setItem("classID", "");
		localStorage.setItem("assignmentID", "");
		
		// set setup as COMPLETE
		localStorage.setItem("setup", "COMPLETE");
	}
	//}
});

/****************************
 *	  ACTION CONTROLLERS	*
 ****************************/
// Cause data methods, and perform callbacks
$(window).hashchange(function() {
	var page = location.hash;
	switch(page)
	{
		//{ Class List View
		case "#homeView":
			alert("Home");
			break;
		//}
		case "#classView":
			alert("Class");
			break;
		case "#assView":
			alert("Assignment");
			break;
		default:
			break;
	}
});

 
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
  doit = setTimeout(repositionBadges, 500);
};
//}

//{ Page Show Events
$(window).on("pageshow", repositionBadges);
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

