/*jshint undef:false */

var TimeHelper = (function(){
	"use strict";
	return {

		getIntervalTime: function(_date1, _date2, formated){

			var date_future = new Date(_date2);
			var date_now = new Date(_date1);

			var seconds = Math.floor((date_future-(date_now))/1000);
			var minutes = Math.floor(seconds/60);
			var hours = Math.floor(minutes/60);
			var days = Math.floor(hours/24);

			hours = hours - (days*24);
			minutes = minutes - (days*24*60) - (hours*60);
			seconds = seconds - (days*24*60*60) - (hours*60*60) - (minutes*60);

			if(formated){
				if(hours < 10){ hours = "0"+hours; }
				if(minutes < 10){ minutes = "0"+minutes; }
				if(seconds < 10){ seconds = "0"+seconds; }
			}

			return {
				hours: hours,
				minutes: minutes,
				seconds: seconds
			};
		}

	};

})();

var Tasks = (function(){

	function Tasks(){
		this.dbName = "tasks";
	}

	var getStorageTasks = function(parsed){
		return (parsed) ? JSON.parse(localStorage.getItem(this.dbName)) : localStorage.getItem(this.dbName);
	};

	Tasks.prototype = {

		getTasks: function(){
			return getStorageTasks.call(this, true);
		},

		saveTask: function(task){

			var tasks = getStorageTasks.call(this, true) || [];
			tasks.push({
				title: task.title,
				description: task.description,
				time: task.time
			});

			localStorage.setItem(this.dbName, JSON.stringify(tasks));
			
		}

	};

	return new Tasks();

})();

var TaskView = (function(){

	function TaskView(){
		this.source = $("#task-template").html();
		this.template = Handlebars.compile(this.source);
	}

	TaskView.prototype = {

		render: function(){
			var self = this;
			var taskList = Tasks.getTasks();
			var html = "";

			for(var a in taskList){

				var context = {
					title: taskList[a].title,
					description: taskList[a].description,
					timer: TimeHelper.getIntervalTime(taskList[a].time, Date.now(), true)
				};

				html += self.template(context);
			}

			$(".tasks").html(html);
			$(".action").on("click", function(e){
				e.preventDefault();
				var $el = $(this);

				if($el.hasClass("play")){
					$el.removeClass("play").addClass("pause");
					$(".fa", $el).removeClass("fa-play").addClass("fa-pause");
				}else{
					$el.removeClass("pause").addClass("play");
					$(".fa", $el).removeClass("fa-pause").addClass("fa-play");
				}

			});

		}
	};

	return new TaskView();

})();

$(document).ready(function(){

	TaskView.render();
	

});

