function XmlReader()
{
	this.xml = undefined;
	this.jq = undefined;
	this.onlyTasks = false;
	this.file = undefined;
	XmlReader.xmlReader = this;
}

XmlReader.xmlReader = undefined;

XmlReader.FileOnChange = function(e)
{
	file = e.target.files[0];
	if(!file) return;
	
	jQuery("#desc-file input[type=file]").addClass('hide');
	jQuery("#desc-file button").removeClass('hide');
	
	if(XmlReader.xmlReader)
		XmlReader.xmlReader.onlyTasks = true;
	else
		new XmlReader();
	
	XmlReader.xmlReader.file = file;
	
	XmlReader.xmlReader.read();
};



XmlReader.prototype.read = function()
{
	var reader = new FileReader();
	reader.onload = this.readerOnLoad.bind(this);
	reader.readAsText(this.file);
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
	
	if(!this.onlyTasks)
	{
		this.prepareSettings();
		this.prepareNetworks();
		this.prepareNodes();
	}
	
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
		//                       0 #       1 ID    2 Status   3 NeID    4 Pub     5 Sub    6 NetStatus
		var jq = jQuery("<tr> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> </tr>");
		
		var id = obj.eq(i).attr("id");
		var network_id = obj.eq(i).attr("network_id");
		var publish = obj.eq(i).find("publish").attr("topic");
		var subscribe = obj.eq(i).find("subscribe").attr("topic");
		var status = obj.eq(i).find("status").attr("topic");
		
		jq.find("td").eq(0).html(i);
		jq.find("td").eq(1).html(id);
		jq.find("td").eq(2).html("_");
		jq.find("td").eq(3).html(network_id);
		jq.find("td").eq(4).html(publish);
		jq.find("td").eq(5).html(subscribe);
		jq.find("td").eq(6).html("<span class=\"label label-default status\">not connected</span>");
		
		jQuery("div#nodes tbody").append(jq);
		
		new NodeModel(i, id, network_id, publish, subscribe, status ,jq)
		
		//=====
		if(publish)
			jQuery("#publishCommandPanel>select").append("<option value='"+id+"'>"+id+" ["+publish+"]"+"</option>");
	}
};



XmlReader.prototype.prepareTasks = function()
{
	jQuery("div#tasks tbody").empty();
	
	new TaskController();
	
	obj = this.jq.find("tasks>task");
	
	for(var i=0; i<obj.length; ++i)
	{
		//                    0 #       1 Type    2 Title   3 Param                  4 Generated
		var jq = jQuery("<tr> <td></td> <td></td> <td></td> <td class='detail'></td> <td class='detail'></td> </tr>");

		jq.attr("ondblclick", "jQuery('#runAutomaticallyChb').get(0).checked = false; TaskController.taskController.setIndex("+i+")")
		jQuery("div#tasks tbody").append(jq);

		TaskRenderer.Index(i);
	}
};