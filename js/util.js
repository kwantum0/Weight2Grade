/*	util.js
	functions and methods to make the application work

	Revision history
		Daniel Franz	 2015.04.01: created
*/

//{ Toggles the Add Class Form Open & Closed
function toggleAddForm() {
	$(".addForm").toggle("fast");
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
function repositionBadges(event, ui) {
	$(".badge-box").each(function(index){
		var numb = $(this).text().trim() + "%";
		$(this).animate({marginLeft: numb}, "faster");
		$(this).animate({marginLeft: "-=36px"}, "faster");
	});
}//}

//{ Moves the badges to the origin
function resetBadges(event, ui) {
	$(".badge-box").each(function(index){
		$(this).css(marginLeft, "0px");
	});
}//}

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
	$("#hoverGrade").show();
	var weight = parseInt($(circle).attr('data-weight'));
	var total = parseInt($("#bar").attr('data-total-weight'));
	var percent = weight / total * 100;
	$("#hoverGrade").width(percent.toString() + "%");
	$(circle).circleProgress({
		value: 1,
		size: 80,
		reverse: true,
		thickness: 12,
		startAngle: 0,
		fill: {color: "#FFAA3B"},
		animation: { duration: 300 }
	}).on('circle-animation-progress', function(event, progress){
		var width = parseInt(weight * progress);
		$("#hoverGrade").text(width);
	});
}//}

//{ Resets both the circular progress bar and the class bar
function deflateCircle(circle){
	$("#hoverGrade").hide();
	$("#hoverGrade").text("");
	$("#hoverGrade").width(0);
	$(circle).circleProgress({
		value: 0,
	})
}//}