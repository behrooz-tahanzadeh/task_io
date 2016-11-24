function TaskController()
{
	this.index = 0;
	this.xml = XmlReader.xmlReader.jq.find("tasks>task");
	
	this.sleepTimeoutIndex = -1;
	
	this.taskStartTs = -1;
	
	this.SSU = new SpeechSynthesisUtterance();
	this.SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Male'; })[0]
	this.SSU.lang = 'en-GB';
	this.SSU.onend = this.next.bind(this);
	
	TaskController.taskController = this;
}


TaskController.taskController = undefined;


TaskController.prototype.setIndex = function(i)
{
	this.index = i;
	
	this.renderTaskList().renderNavButtons().renderCurrentTaskPanel();
	
	if(jQuery("#runAutomaticallyChb").get(0).checked)
		setTimeout(this.run.bind(this), 20);
}


TaskController.prototype.next = function()
{
	this.jump(+1);
}




TaskController.prototype.prev = function()
{
	this.jump(-1);
}


TaskController.prototype.jump = function(s)
{
	if(s == 0)
	{
		console.log("0 jump can make infinite loop! disable autorun...");
		jQuery('#runAutomaticallyChb').get(0).checked = false;
	}
	else if(this.index+s >= 0 && this.index+s < this.xml.length)
		this.setIndex(this.index+s);
}



TaskController.prototype.run = function()
{
	var t = this.xml.eq(this.index);
	
	switch(t.attr("type"))
	{
		case "publish_cmd":
			this.runPublishCmd(t);
			break;
		case "sleep":
			this.runSleep(parseFloat(t.attr("delay_sec"))*1000);
			break;
		case "confirm":
			res = confirm(t.attr("message"));
			this.jump(res ? parseInt(t.attr("on_true")) : parseInt(t.attr("on_false")));
			break;
		case "text-to-speech":
			this.runTextToSpeech(t.attr("text"));
			break;
		case "play_audio":
			this.runPlayAudio(t.attr("url"), t.attr("wait_for_done"));
			break;
	}
}

TaskController.prototype.runPlayAudio = function(url, wait_for_done)
{
	var audio = new Audio(url);
	if(wait_for_done == 'true')
	{
		audio.onended = function(){TaskController.taskController.next();}
		audio.play();
	}
	else
	{
		audio.play();
		this.next();
	}
}


TaskController.prototype.runTextToSpeech = function(text)
{
	var v = Math.floor(Math.random()*3);
	//v = 0;
	//console.log(v);
	
	switch(v)
	{
		case 0:
		case 1:
			this.SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Male'; })[0]
			this.SSU.lang = 'en-GB';
			break;
		case 2:
			this.SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Female'; })[0]
			this.SSU.lang = 'en-GB';
			break;
		case 3:
			this.SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google US English'; })[0]
			this.SSU.lang = 'en-US';
			break;
	}
	
	this.SSU.text = text;
	window.speechSynthesis.speak(this.SSU);
}


TaskController.prototype.runSleep = function(ms)
{
	if(this.sleepTimeoutIndex != -1)
		clearTimeout(this.sleepTimeoutIndex);
	
	this.sleepTimeoutIndex = setTimeout(this.runSleepTimeoutCb.bind(this), ms);
}


TaskController.prototype.runSleepTimeoutCb = function()
{
	this.sleepTimeoutIndex = -1;
	this.next();
}


TaskController.prototype.runPublishCmd = function(obj)
{
	var node_id = obj.attr("node_id");
	var command = obj.attr("command");
	var wait_for_done = obj.attr("wait_for_done") == "true";
	
	var node = NodeModel.GetById(node_id);
	
	if(wait_for_done)
	{
		if(obj.attr("req_timestamp") == undefined)
			obj.attr("req_timestamp", SettingModel.settingModel.getTimestamp());
		
		jQuery("div#tasks tbody>tr.currentTask>td").eq(3).html(obj.attr("req_timestamp"));
		
		command = obj.attr("req_timestamp")+","+command;
	}
			
	
	var cmd = {};
	cmd.data = command;
	
	node.publishTopic.publish(new ROSLIB.Message(cmd));
	
	if(!wait_for_done)
		this.next();
}


TaskController.prototype.subscribeCb = function(node, msg)
{
	var obj = this.xml.eq(this.index);
	var node_id = obj.attr("node_id");
	var req_timestamp = obj.attr("req_timestamp");
	
	var msg_req_timestamp = parseInt(msg.data.split(",")[0]);
	var msg_progress = parseInt(msg.data.split(",")[1]);
	
	if(node_id == node.id && req_timestamp == msg_req_timestamp)
		if(msg_progress == 100)
			TaskController.taskController.next();
		else
			console.log("Task is not done yet!");
	else
		console.log("Invalid income msg!");
}



TaskController.prototype.renderTaskList = function()
{
	jQuery("div#tasks tbody>tr").removeClass("currentTask");
	jQuery("div#tasks tbody>tr").eq(this.index).addClass("currentTask");
	return this;
}


TaskController.prototype.renderNavButtons = function()
{
	jQuery("#navButtons>button").removeClass("disabled");
	
	if(this.index-1 < 0)
		jQuery("#navButtons>button.prev").addClass("disabled");
	
	if(this.index+1 >= this.xml.length)
		jQuery("#navButtons>button.next").addClass("disabled");
	
	return this;
}


TaskController.prototype.renderCurrentTaskPanel = function()
{
	var jq = jQuery("div#currentTaskPanel>div");
	jq.html("<b>Number: </b>"+this.index+"<br>"+jQuery("div#tasks tbody>tr.currentTask>td").eq(2).html());
	
	return this;
}


TaskController.prototype.removeTimestamp = function()
{
	var obj = this.xml.eq(this.index);
	jQuery("div#tasks tbody>tr:eq("+this.index+")>td:eq(3)").html("__");
	obj.removeAttr("req_timestamp");
}