/*	global.js
	runs on the initial set-up and binds event handlers

	Revision history
		Daniel Franz	 2015.04.01: created
*/
/****************************
 *		DOCUMENT READY		*
 ****************************/
$(document).ready(function() {
	
	
});

/****************************
 *	 	 EVENT BINDING		*
 ****************************/
 
// Window Resize Event
var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(repositionBadges, 500);
};

// Page Show Events
$(window).on("pageshow", repositionBadges);
$(window).on("pageshow", revealCircles);

// Assignment List Expand Event
$(document).on("collapsibleexpand", function() {
	var str = $("#taskToggle").text();
	if(str == "Cancel"){
		toggleTaskForm();
	}
	$(".circle").circleProgress("redraw");
});

// Assignment Item Hover Events
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