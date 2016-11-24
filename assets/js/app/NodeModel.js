function NodeModel(i, id, network_id, publish, subscribe ,jq)
{
	this.i = i;
	this.id = id;
	this.network_id = network_id;
	this.jq = jq;
	
	this.publish = publish;
	this.subscribe = subscribe;
	
	this.publishTopic = this.subscribeTopic = undefined;
	
	this.networkModel = NetworkModel.GetById(this.network_id);
	this.networkModel.statusChanged.add(this.prepareTopics.bind(this));
	
	NodeModel.List.push(this);
};


NodeModel.List = [];


NodeModel.GetById = function(id)
{
	for(var i=0; i<NodeModel.List.length; ++i)
	{
		if(NodeModel.List[i].id == id)
			return NodeModel.List[i];
	}
};


NodeModel.prototype.prepareTopics = function()
{
	if(this.networkModel.isRosConnected)
	{
		if(this.publish)	
		{
			this.publishTopic = new ROSLIB.Topic({ros:this.networkModel.ros , name:this.publish , messageType:'std_msgs/String'});
			this.publishTopic.advertise();
			console.info("publish topic has been prepared. Topic: "+this.publish);
		}
		
		if(this.subscribe)	
		{
			this.subscribeTopic = new ROSLIB.Topic({ros:this.networkModel.ros , name:this.subscribe , messageType:'std_msgs/String'});
			this.subscribeTopic.subscribe(this.subscribeCb.bind(this));
			console.info("subscribe topic has been prepared. Topic: "+this.subscribe);
		}
		
		this.renderStatus("Ready", "label-success");
	}
	else
	{
		this.renderStatus("Network closed", "label-danger");
	}
};


NodeModel.prototype.subscribeCb = function(msg)
{
	console.log(msg);
	TaskController.taskController.subscribeCb(this, msg);
};



NodeModel.prototype.renderStatus = function(t, c)
{	
	this.jq.find(".status").text(t);
	
	this.jq.find(".status")
		.removeClass("label-success label-default label-danger label-warning")
		.addClass(c);
}
