class FileLoaderList
{
	static fileOnChange(e)
	{
		var file = e.target.files[0];
		if(!file) return;
		
		var reader = new FileReader();
		reader.onload = FileLoaderList.readerOnLoad;
		reader.readAsText(file);
	}

	

	static readerOnLoad(e)
	{
		var data = e.target.result;
		FileLoaderList.xml = jQuery(jQuery.parseXML(data));

		FileLoaderList.prepareTemplates();
		FileLoaderList.prepareSettings();
		FileLoaderList.prepareNetworks();
		FileLoaderList.prepareNodes();
		FileLoaderList.prepareTasks();
	}



	static prepareTemplates()
	{
		var obj = FileLoaderList.xml.find("tasks>task[type=template]");
	
		for(var i=0; i<obj.length; ++i)
		{
			var template_id = obj.eq(i).attr('template_id');
			var template = FileLoaderList.xml.find("task_templates>task_template[id="+template_id+"]").get(0).innerHTML;
			
			var attributes = obj.get(i).attributes;
			
			for(var j=0; j<attributes.length; ++j)
				template = template.replace("{"+attributes[j].name+"}",attributes[j].value);
			
			obj.eq(i).replaceWith(template);
		}
	}



	static prepareSettings()
	{
		var obj = new SettingModel();
		
		obj.publishTopicTemplate = FileLoaderList.xml.find("settings>topictemplate>publish").attr("value");
		obj.subscribeTopicTemplate = FileLoaderList.xml.find("settings>topictemplate>subscribe").attr("value");
		obj.requestIdLength =  parseInt(FileLoaderList.xml.find("settings>request_id").attr("length"));
	}



	static prepareNetworks()
	{
		var obj = FileLoaderList.xml.find("networks>network");
		
		for(var i=0; i<obj.length; ++i)
			new NetworkModel().initByXML(obj.eq(i)).append();
	}



	static prepareNodes()
	{
		var obj = FileLoaderList.xml.find("nodes>node");
		
		for(var i=0; i<obj.length; ++i)
			new NodeModel().initByXML(obj.eq(i)).append();

		NodeModel.ChangeSignal.dispatch();
	}



	static prepareTasks()
	{
		jQuery("div#tasks tbody").empty();
		
		var obj = FileLoaderList.xml.find("tasks>task");
		
		for(var i=0; i<obj.length; ++i)
			new TaskModel().initByXML(obj.eq(i)).append();

		TasksList.renderNumbers();
	}

}