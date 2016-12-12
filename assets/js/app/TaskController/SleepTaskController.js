"use strict";

class SleepTaskController
{
	isMatching(cmdName)
	{
		return cmdName == "sleep";
	}


	run(taskController, xmlElement, jqElement)
	{
		console.log(this);

		this.taskController = taskController;
		this.xmlElement = xmlElement;
		this.jqElement = jqElement;

		var delayMS = parseFloat(xmlElement.find("param").attr("delay_sec"))*1000;

		this.clearTimeout().setTimeout(delayMS);
	}


	clearTimeout()
	{
		clearTimeout(this.timeoutID);
		this.timeoutID = -1;
		return this;
	}


	setTimeout(delay)
	{
		setTimeout(this.timeoutCb.bind(this), delay);
	}


	timeoutCb()
	{
		this.timeoutID = -1;
		this.taskController.next();
	}

	cancel()
	{
		this.clearTimeout();
	}
}

TaskController.Controllers.push(new SleepTaskController());