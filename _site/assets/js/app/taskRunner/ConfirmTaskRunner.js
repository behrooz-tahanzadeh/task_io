"use strict";

class ConfirmTaskRunner
{
	isMatching(model)
	{
		return model.type == "confirm";
	}


	run(model)
	{
		var res = confirm(model.param["message"]);
		TasksList.jump(res ? parseInt(model.param["on_true"]) : parseInt(model.param["on_false"]));
	}
}