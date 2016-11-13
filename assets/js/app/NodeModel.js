function NodeModel(i, id, network_id ,jq)
{
	this.i = i;
	this.id = id;
	this.network_id = network_id;
	this.jq = jq;
	
	this.cmdProgressTopic = this.cmdDoTopic = undefined;
	
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
		this.cmdDoTopic = new ROSLIB.Topic({ros:this.networkModel.ros , name:"task_io/"+this.id+"/do_cmd" , messageType:'std_msgs/String'});
		this.cmdProgressTopic = new ROSLIB.Topic({ros:this.networkModel.ros , name:"task_io/"+this.id+"/cmd_progress" , messageType:'std_msgs/String'});
		
		this.cmdDoTopic.advertise();
		this.cmdProgressTopic.subscribe(this.cmdProgressCb.bind(this));
		
		this.renderStatus("Ready", "label-success");
	}
	else
	{
		this.renderStatus("Network closed", "label-danger");
	}
};


NodeModel.prototype.cmdProgressCb = function(msg)
{
	console.log(msg);
	TaskController.taskController.cmdProgressCb(this, msg);
};



NodeModel.prototype.renderStatus = function(t, c)
{	
	this.jq.find(".status").text(t);
	
	this.jq.find(".status")
		.removeClass("label-success label-default label-danger label-warning")
		.addClass(c);
}