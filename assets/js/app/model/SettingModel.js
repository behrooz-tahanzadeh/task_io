function SettingModel()
{
	this.publishTopicTemplate = "/task_io/{node_id}/goal";
	this.subscribeTopicTemplate = "/task_io/{node_id}/feedback";
	this.requestIdLength = undefined;
	
	SettingModel.settingModel = this;
}

SettingModel.settingModel = undefined;

SettingModel.prototype.getPublishTopic = function(node_id)
{
	return this.publishTopicTemplate.replace("{node_id}", node_id)
}

SettingModel.prototype.getSubscribeTopic = function(node_id)
{
	return this.subscribeTopicTemplate.replace("{node_id}", node_id)
}


SettingModel.prototype.getTimestamp = function()
{	
	var d = Date.now();
	var l = this.requestIdLength
	
	console.log(d);
	
	return l == undefined ? d : d % Math.pow(10,l+1)
		
};