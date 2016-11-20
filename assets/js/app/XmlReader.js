function XmlReader()
{
	this.xml = undefined;
	this.jq = undefined;
	
	XmlReader.xmlReader = this;
}

XmlReader.xmlReader = undefined;

XmlReader.FileOnChange = function(e)
{
	file = e.target.files[0];
	if(!file) return;
	jQuery("#desc-file").addClass('hide');
	new XmlReader().read(file);
};



XmlReader.prototype.read = function(file)
{
	var reader = new FileReader();
	reader.onload = this.readerOnLoad.bind(this);
	reader.readAsText(file);
};



XmlReader.prototype.readerOnLoad = function(e)
{
	var data = e.target.result;
	
	this.xml = data;
	this.jq = jQuery(jQuery.parseXML(data));
	this.prepare();
};



XmlReader.prototype.prepare = function()
{
	this.prepareTemplates();
	this.prepareSettings();
	this.prepareNetworks();
	this.prepareNodes();
	this.prepareTasks();
};




XmlReader.prototype.prepareTemplates = function()
{
	var obj = this.jq.find("tasks>task[type=template]");
	
	for(var i=0; i<obj.length; ++i)
	{
		var template_id = obj.eq(i).attr('template_id');
		var template = this.jq.find("task_templates>task_template[id="+template_id+"]").get(0).innerHTML;
		
		var attributes = obj.get(i).attributes;
		
		for(var j=0; j<attributes.length; ++j)
			template = template.replace("{"+attributes[j].name+"}",attributes[j].value);
		
		obj.eq(i).replaceWith(template);
	}
};




XmlReader.prototype.prepareSettings = function()
{
	var obj = new SettingModel();
	
	obj.publishTopicTemplate = this.jq.find("settings>topictemplate>publish").attr("value");
	obj.subscribeTopicTemplate = this.jq.find("settings>topictemplate>subscribe").attr("value");
	obj.requestIdLength =  parseInt(this.jq.find("settings>request_id").attr("length"));
}


XmlReader.prototype.prepareNetworks = function()
{
	obj = this.jq.find("networks>network");
	
	for(var i=0; i<obj.length; ++i)
	{
		var jq = jQuery("<tr><td></td> <td></td> <td></td> <td></td></tr>");
		var id = obj.eq(i).attr("id");
		var url = obj.eq(i).attr("url")
		
		jq.find("td").eq(0).html(i);
		jq.find("td").eq(1).html(id);
		jq.find("td").eq(2).html(url);
		jq.find("td").eq(3).html("<span class=\"label label-default status\">waiting...</span>");
		
		jQuery("div#networks tbody").append(jq);
		new NetworkModel(i, id, url, jq);
	}
};



XmlReader.prototype.prepareNodes = function()
{
	obj = this.jq.find("nodes>node");
	
	for(var i=0; i<obj.length; ++i)
	{
		var jq = jQuery("<tr> <td></td> <td></td> <td></td> <td></td> </tr>");
		
		var id = obj.eq(i).attr("id");
		var network_id = obj.eq(i).attr("network_id");
		
		jq.find("td").eq(0).html(i);
		jq.find("td").eq(1).html(id);
		jq.find("td").eq(2).html(network_id);
		jq.find("td").eq(3).html("<span class=\"label label-default status\">not connected</span>");
		
		jQuery("div#nodes tbody").append(jq);
		
		new NodeModel(i, id, network_id ,jq)
		
		//=====
		jQuery("#publishCommandPanel>select").append("<option>"+id+"</option>");
	}
};



XmlReader.prototype.prepareTasks = function()
{
	new TaskController();
	
	obj = this.jq.find("tasks>task");
	
	for(var i=0; i<obj.length; ++i)
	{
		var jq = jQuery("<tr> <td></td> <td></td> <td></td> <td></td> </tr>");

		jq.find("td").eq(0).html(i);
		jq.find("td").eq(1).html(obj.eq(i).attr("type"));
		
		switch(obj.eq(i).attr("type"))
		{
			case "publish_cmd":
				jq.find("td").eq(2).html(
					"<b>node_id: </b>"+obj.eq(i).attr("node_id")+"<br>"+
					"<b>command: </b>"+obj.eq(i).attr("command")+"<br>"+
					"<b>wait_for_done: </b>"+obj.eq(i).attr("wait_for_done")
				);
				break;
			case "sleep":
				jq.find("td").eq(2).html(
					"<b>delay_sec: </b>"+obj.eq(i).attr("delay_sec")
				);
				break;
			case "confirm":
				jq.find("td").eq(2).html(
					"<b>message: </b>"+obj.eq(i).attr("message")+"<br>"+
					"<b>on_true: </b>"+obj.eq(i).attr("on_true")+"<br>"+
					"<b>on_false: </b>"+obj.eq(i).attr("on_false")
				);
				break;
			case "text-to-speech":
				jq.find("td").eq(2).html(
					"<b>text: </b>"+obj.eq(i).attr("text")
				);
				break;
		}
		
		jq.find("td").eq(3).html("__");
		
		jq.attr("ondblclick", "jQuery('#runAutomaticallyChb').get(0).checked = false; TaskController.taskController.setIndex("+i+")")
		jQuery("div#tasks tbody").append(jq);
	}
};