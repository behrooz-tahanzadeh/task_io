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
			var eq = obj.eq(i);

			var id = eq.attr('id');
			var template = FileLoaderList.xml.find(`task_templates>task_template[id=${id}]`).get(0).innerHTML;

			var attributes = eq.find("param").get(0).attributes;

			for(var j=0; j<attributes.length; ++j)
				template = template.replace(new RegExp("{"+attributes[j].name+"}", 'g'), attributes[j].value);

			eq.replaceWith(template);
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