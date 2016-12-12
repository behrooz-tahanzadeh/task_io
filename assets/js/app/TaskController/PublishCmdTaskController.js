"use strict";



class PublishCmdTaskController
{
	isMatching(cmdName)
	{
		return cmdName == "publish_cmd";
	}



	run(taskController, xmlElement, jqElement)
	{
		console.log(this);

		this.taskController = taskController;
		this.xmlElement = xmlElement;
		this.jqElement = jqElement;

		var node_id = xmlElement.find("param").attr("node_id");
		var command = xmlElement.find("param").attr("command");
		var wait_for = xmlElement.find("param").attr("wait_for");

		var node = NodeModel.GetById(node_id);

		if(xmlElement.find("generated").length == 0)
			xmlElement.append('<generated/>');

		if(xmlElement.find('generated').attr("req_timestamp") == undefined)
			xmlElement.find('generated').attr("req_timestamp", SettingModel.settingModel.getTimestamp());

		var ts = xmlElement.find('generated').attr("req_timestamp")

		var command_compiled = command.replace("{ts}",ts);

		if(wait_for)
			var wait_for_compiled = wait_for.replace("{ts}",ts);

		xmlElement.find('generated').attr("command_compiled", command_compiled);

		if(wait_for)
			xmlElement.find('generated').attr("wait_for_compiled", wait_for_compiled);

		var cmd = {};
		cmd.data = command_compiled;

		console.log(command_compiled);
	
		node.publishTopic.publish(new ROSLIB.Message(cmd));
	
		if(!wait_for)
			this.done()

		TaskRenderer.Index(xmlElement.index());

		return this;
	}



	done()
	{
		this.taskController.next();
	}



	subscribeCb(taskController, xmlElement, jqElement, node, msg)
	{
		this.taskController = taskController;
		this.xmlElement = xmlElement;
		this.jqElement = jqElement;

		var node_id = xmlElement.find('param').attr("node_id");
		var wait_for_compiled = xmlElement.find('generated').attr("wait_for_compiled", wait_for_compiled);

		if(node_id == node.id && msg.data == wait_for_compiled)
			this.done();
	}
}



TaskController.Controllers.push(new PublishCmdTaskController());