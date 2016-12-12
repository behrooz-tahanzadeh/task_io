"use strict";

class ConfirmTaskController
{
	isMatching(cmdName)
	{
		return cmdName == "confirm";
	}


	run(taskController, xmlElement, jqElement)
	{
		console.log(this);

		this.taskController = taskController;
		this.xmlElement = xmlElement;
		this.jqElement = jqElement;

		var onTrue = parseInt(xmlElement.find("param").attr('on_true'));
		var onFalse = parseInt(xmlElement.find("param").attr('on_false')); 
		var res = confirm(xmlElement.find("param").attr("message"));

		this.taskController.jump(res ? onTrue : onFalse);
	}
}

TaskController.Controllers.push(new ConfirmTaskController());