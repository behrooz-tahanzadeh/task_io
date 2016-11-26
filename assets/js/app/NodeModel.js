function NodeModel(i, id, network_id, publish, subscribe, status, jq)
{
	this.i = i;
	this.id = id;
	this.network_id = network_id;
	this.jq = jq;
	
	this.publish = publish;
	this.subscribe = subscribe;
	this.status = status;
	this.statusID = -1;
	
	this.statusTopic = this.publishTopic = this.subscribeTopic = undefined;
	
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
		
		if(this.status)	
		{
			this.statusTopic = new ROSLIB.Topic({ros:this.networkModel.ros , name:this.status});
			this.statusTopic.subscribe(this.statusCb.bind(this));
			console.info("status topic has been prepared. Topic: "+this.status);
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

NodeModel.prototype.statusCb = function(msg)
{
	if(this.statusID == msg.id)
		return;
	
	this.statusID = msg.id;
	
	var o = jQuery("<span>"+msg.title+"</span>");
	o.addClass("label");
	
	switch(msg.level)
	{
	case 'SUCCESS':
		o.addClass("label-success");
		break;
	case 'INFO':
		o.addClass("label-primary");
		break;
	case 'WARNING':
		o.addClass("label-warning");
		break;
	case 'ERROR':
		o.addClass("label-danger");
		break;
	}
	
	this.jq.find("td:eq(2)").html(o);
	
	if(msg.level == 'ERROR')
	{
		var SSU = new SpeechSynthesisUtterance();
		SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Male'; })[0]
		SSU.lang = 'en-GB';
		SSU.rate = 1.05;
		SSU.pitch = 1.25;
		SSU.text = msg.description;
		window.speechSynthesis.speak(SSU);
	}
};



NodeModel.prototype.renderStatus = function(t, c)
{	
	this.jq.find(".status").text(t);
	
	this.jq.find(".status")
		.removeClass("label-success label-default label-danger label-warning")
		.addClass(c);
}
