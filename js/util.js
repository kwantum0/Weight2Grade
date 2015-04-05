/*	util.js
	functions and methods to make the application work

	Revision history
		Daniel Franz	 2015.04.01: created
*/

//{ Toggles the Add Class Form Open & Closed
function toggleAddForm() {
	$(".addClassForm").toggle("fast");
	var str = $("#addToggle").text();
	if(str == "Add Class")
	{
		$("#addToggle").text("Cancel")
					   .removeClass("ui-icon-plus")
					   .addClass("ui-icon-minus");
	}
	else
	{
		$("#addToggle").text("Add Class")
					   .removeClass("ui-icon-minus")
					   .addClass("ui-icon-plus");
	}
}//}

//{ Toggles the Add Task Form Open & Closed
function toggleTaskForm() {
	$(".taskForm").toggle("fast");
	var str = $("#taskToggle").text();
	if(str == "Add Task")
	{
		$("#taskToggle").text("Cancel")
					   .removeClass("ui-icon-plus")
					   .addClass("ui-icon-minus");
		$("#addSpace1 .ui-collapsible").collapsible("collapse");
		
	}
	else
	{
		$("#taskToggle").text("Add Task")
					   .removeClass("ui-icon-minus")
					   .addClass("ui-icon-plus");
	}
}//}

//{ Moves the badges to their proper location 
function resetBadges(event, ui) {
	$(".badge-box").each(function(index){
		var numb = $(this).text().trim() + "%";
		$(this).animate({marginLeft: numb}, "faster");
		$(this).animate({marginLeft: "-=13px"}, "faster");
	});
}//}

/* Moves the badges to the origin
function resetBadges(event, ui) {
	$(".badge-box").each(function(index){
		$(this).css(marginLeft, "0px");
	});
}*/

//{ Animates the circular progress bars
function revealCircles() {
	$.each($(".circle"), function(key, value){
		var percent = parseFloat($(value).attr('data-value'));
		$(value).circleProgress({
			value: percent,
			size: 80,
			reverse: true,
			thickness: 12,
			startAngle: 0,
			fill: {color: "#337ab7"},
			animation: { duration: 600 }
		}).on('circle-animation-progress', function(event, progress){
			$(value).find('strong').html(parseInt(100 * percent * progress) + '<i>%</i>');
		});
	});
}//}

//{ Animates both the circular progress bar and the class bar
function pumpCircle(circle){
	$(".hoverGrade").show();
	var weight = parseInt($(circle).attr('data-weight'));
	var total = parseInt($("#bar").attr('data-total-weight'));
	var percent = Math.ceil(weight / total * 100);
	$(".hoverGrade").width(percent.toString() + "%");
	$(circle).circleProgress({
		value: 1,
		size: 80,
		reverse: true,
		thickness: 12,
		startAngle: 0,
		fill: {color: "#FFAA3B"},
		animation: { duration: 600 }
	}).on('circle-animation-progress', function(event, progress){
		var width = parseInt(percent * progress);
		$(".hoverGrade").text(width);
	});
}//}

//{ Resets both the circular progress bar and the class bar
function deflateCircle(circle){
	$(".hoverGrade").hide();
	$(".hoverGrade").text("");
	$(".hoverGrade").width(0);
	$(circle).circleProgress({
		value: 0,
	})
}//}

//{ Capitalizes only first letter of a string for TYPE NAME
function typeFormat(str){
	return str.substring(0,1).toUpperCase() + str.substring(1,str.length).toLowerCase();
}//}

//{ Escapes special characters 
function sanitize(str, code){
	// required sanitation
	var regex;
	switch(code){
		default:
	}
	
	return str;
}//}

//{ Sets the classId session variable
function setClassId(id) {
	localStorage.setItem("classID", id);
}//}

//{ Sets the assignmnetId session variable
function setAssId(id) {
	localStorage.setItem("assignmentID", id);
}//}

//{ Sets the hover event for assignments li 
function setHoverStates() {
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
}//}

//{ Rebuilds all the jquery components on a page
function refreshLists() {
	$('ul[data-role="listview"]').listview().listview("refresh");
	resetBadges(null, null);
	revealCircles();
	setHoverStates();
}//}

/****************************
 *		  VALIDATION		*
 ****************************/
function refreshValidation() {
	//{ Sets up the Class Add Form validation
	$("#classAdd").validate({
		errorPlacement: function(error, element) {
			error.appendTo(element.parent("div").parent("li"));
		},
		rules: {
			addClassCode: {
				required: true,
				rangelength: [2,30]
			},
			addClassDesc: {
				rangelength: [0,250]
			},
			addClassGoal: {
				range: [0,100]
			}
		},
		messages: {
			addClassCode: "Class Code must be between 2 and 30 characters long.",
			addClassDesc: "Description must be less than 250 characters long.",
			addClassGoal: "Target Grade is a percent between 0 and 100."
		}
	});//}
	//{ Sets up the Assignment Add Form validation
	$("#assAdd").validate({
		errorPlacement: function(error, element) {
			error.appendTo(element.closest("li"));
		},
		rules: {
			addAssName: {
				required: true,
				rangelength: [2,30]
			},
			addAssDesc: {
				rangelength: [0,250]
			},
			addAssDate: {
				required: true,
				date: true
			},
			addAssWeight: {
				required: true,
				range: [0,1000]
			}
		},
		messages: {
			addAssName: "Name must be between 2 and 30 characters long.",
			addAssDesc: "Description must be less than 250 characters long.",
			addAssDate: "Due Date is required.",
			addAssWeight: "Weight must be whole number between 1 and 1,000."
		}
	});//}
	//{ Sets up the Edit Class Form validation
	$("#classEdit").validate({
		errorPlacement: function(error, element) {
			$(element).parent("div").after(error);
		},
		rules: {
			editClassCode: {
				required: true,
				rangelength: [2,30]
			},
			editClassDesc: {
				rangelength: [0,250]
			},
			editClassGoal: {
				range: [0,100]
			},
			editClassPass: {
				range: [0,100]
			}
		},
		messages: {
			editClassCode: "Class Code must be between 2 and 30 characters long.",
			editClassDesc: "Description must be less than 250 characters long.",
			editClassGoal: "Target Grade is a percent between 0 and 100.",
			editClassPass: "Pass Grade is a percent between 0 and 100."
		}
	});//}
}



