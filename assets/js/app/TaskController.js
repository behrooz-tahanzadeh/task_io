function TaskController()
{
	this.index = 0;
	this.xml = XmlReader.xmlReader.jq.find("tasks>task");
	
	this.taskStartTs = -1;
	
	TaskController.taskController = this;
}


TaskController.taskController = undefined;
TaskController.Controllers = [];


TaskController.prototype.setIndex = function(i)
{
	this.index = i;
	
	this.renderTaskList().renderNavButtons().renderCurrentTaskPanel();
	
	if(jQuery("#runAutomaticallyChb").get(0).checked)
		setTimeout(this.run.bind(this), 20);
}


TaskController.prototype.next = function()
{
	this.jump(+1);
};


TaskController.prototype.prev = function()
{
	this.jump(-1);
};


TaskController.prototype.jump = function(s)
{
	if(s == 0)
	{
		console.log("0 jump can make infinite loop! disable autorun...");
		jQuery('#runAutomaticallyChb').get(0).checked = false;
	}
	else if(this.index+s >= 0 && this.index+s < this.xml.length)
		this.setIndex(this.index+s);
};



TaskController.prototype.run = function()
{
	var xmlElement = this.xml.eq(this.index);
	var jqElement = jQuery("div#tasks tbody>tr:eq("+this.index+")");
	
	for(var i=0; i<TaskController.Controllers.length; ++i)
		if(TaskController.Controllers[i].isMatching(xmlElement.attr("type")))
			TaskController.Controllers[i].run(this, xmlElement, jqElement);
};



TaskController.prototype.subscribeCb = function(node, msg)
{
	var xmlElement = this.xml.eq(this.index);
	var jqElement = jQuery("div#tasks tbody>tr:eq("+this.index+")");

	for(var i=0; i<TaskController.Controllers.length; ++i)
		if(TaskController.Controllers[i].isMatching(xmlElement.attr("type")))
			TaskController.Controllers[i].subscribeCb(this, xmlElement, jqElement, node, msg);
}



TaskController.prototype.renderTaskList = function()
{
	jQuery("div#tasks tbody>tr").removeClass("currentTask");
	jQuery("div#tasks tbody>tr").eq(this.index).addClass("currentTask");
	return this;
}


TaskController.prototype.renderNavButtons = function()
{
	jQuery("#navButtons>button").removeClass("disabled");
	
	if(this.index-1 < 0)
		jQuery("#navButtons>button.prev").addClass("disabled");
	
	if(this.index+1 >= this.xml.length)
		jQuery("#navButtons>button.next").addClass("disabled");
	
	return this;
}


TaskController.prototype.renderCurrentTaskPanel = function()
{
	var jq = jQuery("div#currentTaskPanel>div");
	jq.html("<b>Number: </b>"+this.index+"<br>"+jQuery("div#tasks tbody>tr.currentTask>td").eq(3).html());
	
	return this;
}


TaskController.prototype.removeTimestamp = function()
{
	var obj = this.xml.eq(this.index).find("generated");
	obj.remove();
	TaskRenderer.Index(this.index);
}