class NodeModel
{
	static init()
	{
		NodeModel.List = [];
		NodeModel.ChangeSignal = new signals.Signal();
	}



	static GetById(id)
	{
		for(var i=0; i<NodeModel.List.length; ++i)
		{
			if(NodeModel.List[i].id == id)
				return NodeModel.List[i];
		}
		
		return undefined;
	}



	constructor()
	{
		this.id = undefined;
		this.network_id = undefined;
		this.jq = undefined;
		
		this.publish = undefined;
		this.subscribe = undefined;
		this.status = undefined;
		this.statusID = -1;
		
		this.statusTopic = this.publishTopic = this.subscribeTopic = undefined;
		
		this.networkModel = undefined;
		
		NodeModel.List.push(this);
	}



	initByXML(xml)
	{
		this.id = xml.attr("id");
		this.network_id = xml.attr("network_id");
		this.publish = xml.find("publish").attr("topic");
		this.publishRepeat = xml.find("publish").attr("repeat");
		this.publishRepeatInterval = xml.find("publish").attr("repeat_interval");
		this.subscribe = xml.find("subscribe").attr("topic");
		this.status = xml.find("status").attr("topic");

		this.networkModel = NetworkModel.GetById(this.network_id);
		this.networkModel.statusChanged.add(this.prepareTopics.bind(this));

		this.publishRepeatCounter = 0;
		this.publishRepeatIntervalId = -1;
		this.lastPublishedData = undefined;

		return this;
	}



	append()
	{
		//                       0 #       1 ID    2 Status   3 NetID   4 Pub     5 Sub    6 NetStatus
		this.jq = jQuery("<tr> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr>");

		jQuery("div#nodes tbody").append(this.jq);
		this.update();

		return this;
	}



	update()
	{
		if(this.jq)
		{
			this.jq.find("td:eq(0)").html(this.jq.index());
			this.jq.find("td:eq(1)").html(this.id);
			this.jq.find("td:eq(2)").html("_");
			this.jq.find("td:eq(3)").html(this.network_id);
			this.jq.find("td:eq(4)").html(this.publish);
			this.jq.find("td:eq(5)").html(this.subscribe);
			this.jq.find("td:eq(6)").html("<span class=\"label label-default status\">not connected</span>");
		}

		return this;
	}

	prepareTopics()
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
				this.statusTopic = new ROSLIB.Topic({ros:this.networkModel.ros, name:this.status, messageType:"task_io/Status"});
				this.statusTopic.subscribe(this.statusCb.bind(this));
				console.info("status topic has been prepared. Topic: "+this.status);
			}
			
			this.renderStatus("Ready", "label-success");
		}
		else
		{
			this.renderStatus("Network closed", "label-danger");
		}
	}



	subscribeCb(msg)
	{
		NavigationPanel.subscribeCb(this, msg);
	}



	statusCb(msg)
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
		
		//if(msg.level == 'ERROR')
		//{
			var SSU = new SpeechSynthesisUtterance();
			SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Male'; })[0]
			SSU.lang = 'en-GB';
			SSU.rate = 1.1;
			SSU.pitch = 1.1;
			
			var v = Math.floor(Math.random()*3);
			
			switch(v)
			{
				case 0:
				case 1:
					SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Male'; })[0]
					SSU.lang = 'en-GB';
					break;
				case 2:
					SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Female'; })[0]
					SSU.lang = 'en-GB';
					break;
				case 3:
					SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google US English'; })[0]
					SSU.lang = 'en-US';
					break;
			}
			
			
			SSU.text = msg.description;
			window.speechSynthesis.speak(SSU);
		//}
	}



	renderStatus(t, c)
	{	
		this.jq.find(".status").text(t);
		
		this.jq.find(".status")
			.removeClass("label-success label-default label-danger label-warning")
			.addClass(c);
	}

	publishData(data)
	{
		console.log(data);
		this.publishTopic.publish(data);
		this.lastPublishedData = data;
		if(this.publishRepeat != undefined)
		{
			if(this.publishRepeatIntervalId != -1)
				clearInterval(this.publishRepeatIntervalId);

			this.publishRepeatCounter = 0;

			this.publishRepeatIntervalId = setInterval(this.repeatPublish.bind(this), this.publishRepeatInterval);
		}
	}

	repeatPublish()
	{
		if(this.publishRepeatCounter < this.publishRepeat)
		{
			console.log(this.lastPublishedData);
			this.publishTopic.publish(this.lastPublishedData);
			this.publishRepeatCounter++;
		}
		else
		{
			clearInterval(this.publishRepeatIntervalId);
			this.publishRepeatIntervalId = -1;
		}
	}

}