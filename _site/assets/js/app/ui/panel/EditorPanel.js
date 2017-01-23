
class EditorPanel
{
	static getType()
	{
		return jQuery("#editorPanel_type").val();
	}

	static getParam()
	{
		var type = EditorPanel.getType();
		var param = {};
		var jq = jQuery("#editorPanel_editors_"+type+" *[name]");

		for(var i = 0; i<jq.length; ++i)
			param[jq.eq(i).attr('name')] = jq.eq(i).val();
		
		return param;
	}

	static getTitle()
	{
		return jQuery("#editorPanel_title").val();
	}

	static typeOnChange()
	{
		EditorPanel.render();
	}

	static render()
	{
		var type = EditorPanel.getType();
		jQuery("#editorPanel>.editors>div").addClass('hide');
		jQuery("#editorPanel_editors_"+type).removeClass('hide');
	}

	static addNewOnClick()
	{
		NavigationPanel.disableAutomatic();

		var t = new TaskModel();
		t.type = EditorPanel.getType();
		t.title = EditorPanel.getTitle();
		t.param = EditorPanel.getParam();
		t.append(jQuery("div#tasks tbody>tr.currentTask").index());

		TasksList.setCurrent(t.jq.index());
	}



	static moveDownOnClick()
	{
		var jq = jQuery("div#tasks tbody>tr.currentTask");
		
		if(jq.length <= 0)
		{
			console.log("No task has been selected.");
			return;
		}

		if(jq.is(':last-child'))
		{
			console.log("Can not move lower.");
			return;
		}

		var i = jq.index();
			
		NavigationPanel.disableAutomatic();
		
		jq.detach();
		jQuery(`div#tasks tbody>tr:eq(${i})`).after(jq);
		TasksList.renderNumbers();
	}



	static moveUpOnClick()
	{
		var jq = jQuery("div#tasks tbody>tr.currentTask");
		
		if(jq.length <= 0)
		{
			console.log("No task has been selected.");
			return;
		}

		if(jq.is(':first-child'))
		{
			console.log("Can not move higher.");
			return;
		}

		var i = jq.index();
			
		NavigationPanel.disableAutomatic();
		
		jq.detach();
		jQuery(`div#tasks tbody>tr:eq(${i-1})`).before(jq);
		TasksList.renderNumbers();
	}



	static deleteOnClick()
	{
		if(!confirm("Are you sure that you want to delete this task?"))
			return;

		NavigationPanel.disableAutomatic();
		jQuery("div#tasks tbody>tr.currentTask").remove();
		TasksList.renderNumbers();
	}

	static saveXmlOnClick()
	{
		var r = jQuery("<root/>");
		var t = jQuery("<tasks/>");

		var jq = jQuery("div#tasks tbody>tr");

		for(var i=0; i<jq.length; ++i)
		{
			var x = new TaskModel().initByJQ(jq.eq(i)).getXml();
			t.append(x)
		}

		r.append(t);

		var blob = new Blob([vkbeautify.xml(r.get(0).outerHTML)], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "hello world.xml");
	}
}