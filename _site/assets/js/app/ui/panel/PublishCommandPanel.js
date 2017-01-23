class PublishCommandPanel
{
	static init()
	{
		NodeModel.ChangeSignal.add(PublishCommandPanel.NodelModelOnChange);
	}

	static publish()
	{
		var node = NodeModel.GetById(jQuery("#publishCommandPanel>select").val());
	
		var cmd = {};
		cmd.data = jQuery("#publishCommandPanel input").val();
	
		node.publishTopic.publish(new ROSLIB.Message(cmd));
	}

	static NodelModelOnChange()
	{
		jQuery("#publishCommandPanel>select").empty();

		for(var i=0; i<NodeModel.List.length; ++i)
			jQuery("#publishCommandPanel>select").append(
					"<option>"
					+ NodeModel.List[i].id
					+ "</option>"
			);
	}
}