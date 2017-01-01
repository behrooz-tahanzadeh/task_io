EditorUI =
{
	deleteOnClick: function()
	{
		if(!confirm("Are you sure that you want to delete this task?"))
			return;
		
		var t =TaskController.taskController;
		var i = t.index;
		jQuery('#runAutomaticallyChb').get(0).checked = false;
		t.xml.eq(t.index).remove();
		t.xml = XmlReader.xmlReader.jq.find("tasks>task");
		jQuery("div#tasks tbody>tr").eq(t.index).remove();
		t.setIndex(i);
		this.refreshNumbers();
	},
	
	
	moveDownOnClick: function()
	{	
		var t =TaskController.taskController;
		var i = t.index;
		
		if(i>=t.xml.length-1)	
		{
			console.log("can not move lower!");
			return;
		}
			
		
		jQuery('#runAutomaticallyChb').get(0).checked = false;
		
		x = XmlReader.xmlReader.jq.find("tasks>task").eq(i).detach();
		XmlReader.xmlReader.jq.find("tasks>task").eq(i).after(x);
		t.xml = XmlReader.xmlReader.jq.find("tasks>task");
		
		
		x = jQuery("div#tasks tbody>tr").eq(i).detach();
		jQuery("div#tasks tbody>tr").eq(i).after(x);
		t.setIndex(i+1);
		this.refreshNumbers();
	},
	
	moveUpOnClick: function()
	{
		var t =TaskController.taskController;
		var i = t.index;
		
		if(i<=0)	
		{
			console.log("can not move higher!");
			return;
		}
		
		jQuery('#runAutomaticallyChb').get(0).checked = false;
		
		x = XmlReader.xmlReader.jq.find("tasks>task").eq(i).detach();
		XmlReader.xmlReader.jq.find("tasks>task").eq(i-1).before(x);
		t.xml = XmlReader.xmlReader.jq.find("tasks>task");
		
		
		x = jQuery("div#tasks tbody>tr").eq(i).detach();
		jQuery("div#tasks tbody>tr").eq(i-1).before(x);
		t.setIndex(i-1);
		this.refreshNumbers();
	},

	refreshNumbers: function()
	{
		var jq = jQuery("div#tasks tbody>tr");
		
		for(var i=0; i<jq.length; ++i)
		{
			jq.eq(i).attr("ondblclick", "jQuery('#runAutomaticallyChb').get(0).checked = false; TaskController.taskController.setIndex("+i+")")
			jq.eq(i).find("td:eq(0)").html(i);
		}
	}
}