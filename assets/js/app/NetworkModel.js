function NetworkModel(i, id, url ,jq)
{
	this.i = i;
	this.id = id;
	this.url = url;
	this.jq = jq;
	
	this.isRosConnected = false;
	this.statusChanged = new signals.Signal();
	
	this.ros = new ROSLIB.Ros({url : this.url});
	this.ros.on('connection', this.rosOnConnection.bind(this));
	this.ros.on('error', this.rosOnError.bind(this));
	this.ros.on('close', this.rosOnClose.bind(this));
	
	NetworkModel.List.push(this);
};


NetworkModel.List = [];



NetworkModel.GetById = function(id)
{
	for(var i=0; i<NetworkModel.List.length; ++i)
	{
		if(NetworkModel.List[i].id == id)
			return NetworkModel.List[i];
	}
	
	return undefined;
};


NetworkModel.prototype.rosOnConnection = function()
{
	this.isRosConnected = true;
	this.renderStatus("Connected", "label-success");
};


NetworkModel.prototype.rosOnError = function()
{
	this.isRosConnected = false;
	this.renderStatus("Error", "label-danger");
};


NetworkModel.prototype.rosOnClose = function()
{
	this.isRosConnected = false;
	this.renderStatus("Closed", "label-warning");
};


NetworkModel.prototype.renderStatus = function(t, c)
{	
	this.jq.find(".status").text(t);
	
	this.jq.find(".status")
		.removeClass("label-success label-default label-danger label-warning")
		.addClass(c);
	
	this.statusChanged.dispatch();
}