"use strict";



class PublishCmdTaskRunner
{
	isMatching(model)
	{
		return model.type == "publish_cmd";
	}



	run(model)
	{
		this.model = model;

		var node_id = model.param["node_id"]
		var command = model.param["command"];
		var wait_for = model.param["wait_for"];

		var node = NodeModel.GetById(node_id);

		if(model.generated["req_timestamp"] == undefined)
			model.generated["req_timestamp"] = SettingModel.settingModel.getTimestamp();

		var ts = model.generated["req_timestamp"]

		model.generated["command_compiled"] = command.replace("{ts}",ts);

		if(wait_for)
			model.generated["wait_for_compiled"] = wait_for.replace("{ts}",ts);

		var cmd = {};
		cmd.data = model.generated["command_compiled"];

		console.log(model.generated["command_compiled"]);
	
		node.publishTopic.publish(new ROSLIB.Message(cmd));
	
		if(!wait_for)
			this.done()

		model.update();

		return this;
	}



	done()
	{
		TasksList.next();
	}



	subscribeCb(model, node, msg)
	{
		var node_id = model.param["node_id"];
		var wait_for_compiled = model.generated["wait_for_compiled"];

		if(node_id == node.id && msg.data == wait_for_compiled)
			this.done();
	}
}