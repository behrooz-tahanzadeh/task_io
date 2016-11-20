function publishCommandPanel_onClick()
{
	var node = NodeModel.GetById(jQuery("#publishCommandPanel>select").val());
	
	var cmd = {};
	cmd.data = jQuery("#publishCommandPanel input").val();
	
	node.cmdDoTopic.publish(new ROSLIB.Message(cmd));
}


window.onbeforeunload = function()
{
    return "Are you sure? Unsaved changes will be lost...";
}
