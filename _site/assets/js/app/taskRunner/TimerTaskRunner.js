function TimerTaskController(id)
{
	this.id = id;
	this.startTs = undefined;
	this.stopTs = undefined;
}

TimerTaskController.List = [];

TimerTaskController.GetById = function(id)
{
	for(var i=0; i<TimerTaskController.List.length; ++i)
	{
		if(TimerTaskController.List[i].id == id)
			return TimerTaskController.List[i];
	}
	
	return undefined;
};

TimerTaskController.Run = function(controller, xmlElement, jqElement)
{
	if(xmlElement.attr("type") == "start_timer" || xmlElement.attr("type") == "stop_timer" )
	{
		var o = TimerTaskController.GetById(xmlElement.attr("id"));
		
		if(!o)
		{
			o = new TimerTaskController(xmlElement.attr("id"));
			TimerTaskController.List.push(o);
		}
		
		xmlElement.attr("type") == "start_timer" ? o.start() : o.stop();
		
		jqElement.find("td").eq(2).html(2);
	}
};

TimerTaskController.prototype.start = function()
{
	this.startTs = Date.now();
};

TimerTaskController.prototype.stop = function()
{
	this.stopTs = Date.now();
};