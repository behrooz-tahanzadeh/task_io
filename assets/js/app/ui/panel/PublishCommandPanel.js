class PublishCommandPanel
{
	static onClick()
	{
		var node = NodeModel.GetById(jQuery("#publishCommandPanel>select").val());
	
		var cmd = {};
		cmd.data = jQuery("#publishCommandPanel input").val();
	
		node.publishTopic.publish(new ROSLIB.Message(cmd));
	}
}