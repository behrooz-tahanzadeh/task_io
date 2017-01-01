class NetworkModel
{
	static init()
	{
		NetworkModel.List = [];
	}

	static GetById(id)
	{
		for(var i=0; i<NetworkModel.List.length; ++i)
		{
			if(NetworkModel.List[i].id == id)
				return NetworkModel.List[i];
		}
		
		return undefined;
	}



	constructor()
	{
		this.id = undefined;
		this.url = undefined;
		this.isRosConnected = false;
		this.statusChanged = new signals.Signal();
		this.ros = undefined;

		NetworkModel.List.push(this);
	}



	initByXML(xml)
	{
		this.id = xml.attr("id");
		this.url = xml.attr("url");
		
		this.ros = new ROSLIB.Ros({url : this.url});
		this.ros.on('connection', this.rosOnConnection.bind(this));
		this.ros.on('error', this.rosOnError.bind(this));
		this.ros.on('close', this.rosOnClose.bind(this));

		return this;
	}



	append()
	{
		this.jq = jQuery("<tr> <td></td> <td></td> <td></td> <td></td> </tr>");
		jQuery("div#networks tbody").append(this.jq);
		this.update();
		return this;
	}



	update()
	{
		if(this.jq)
		{
			this.jq.find("td").eq(0).html(this.jq.index());
			this.jq.find("td").eq(1).html(this.id);
			this.jq.find("td").eq(2).html(this.url);
			this.jq.find("td").eq(3).html(
				`<button type="button" class="btn btn-warning btn-xs" onclick="NetworkModel.GetById('${this.id}').reconnect()">
					<span class="glyphicon glyphicon-refresh"></span>
					<span class="status">waiting...</span>
				</button>`
			);
		}

		return this;
	}


	rosOnConnection()
	{
		this.isRosConnected = true;
		this.renderStatus("Connected", "btn-success");
	}


	rosOnError()
	{
		this.isRosConnected = false;
		this.renderStatus("Error", "btn-danger");
	}


	rosOnClose()
	{
		this.isRosConnected = false;
		this.renderStatus("Closed", "btn-warning");
	}


	renderStatus(t, c)
	{	
		this.jq.find(".status").text(t);
		
		this.jq.find("button")
			.removeClass("btn-success btn-default btn-danger btn-warning")
			.addClass(c);
		
		this.statusChanged.dispatch();
	}

	reconnect()
	{
		if(this.ros.isConnected)
			this.ros.close();

		this.ros.connect(this.url);
	}
}