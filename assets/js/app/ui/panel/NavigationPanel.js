class NavigationPanel
{
	static init()
	{
		TasksList.currentChangeSignal.add(NavigationPanel.currentTaskOnChange);
	}

	static currentTaskOnChange()
	{
		if(NavigationPanel.isAutomatic())
			setTimeout(NavigationPanel.runOnClick, 20);
	}

	static runOnClick()
	{
		var jq = jQuery("div#tasks tbody>tr.currentTask");
		
		if(jq.length <= 0)
			return;

		var m = new TaskModel().initByJQ(jq);

		for(var i=0; i<Main.taskRunners.length; ++i)
			if(Main.taskRunners[i].isMatching(m))
				Main.taskRunners[i].run(m);
	}



	static subscribeCb(node, msg)
	{
		var jq = jQuery("div#tasks tbody>tr.currentTask");
		
		if(jq.length <= 0)
			return;

		var m = new TaskModel().initByJQ(jq);

		for(var i=0; i<Main.taskRunners.length; ++i)
			if(Main.taskRunners[i].isMatching(m))
				Main.taskRunners[i].subscribeCb(m, node, msg);
	}



	static nextOnClick()
	{
		NavigationPanel.disableAutomatic();
		TasksList.next();
	}

	static prevOnClick()
	{
		NavigationPanel.disableAutomatic();
		TasksList.prev();
	}

	static removeGeneratedOnClick()
	{
		var jq = jQuery("div#tasks tbody>tr.currentTask>td:eq(4)").empty();
	}

	static isAutomatic()
	{
		return jQuery('#runAutomaticallyChb').get(0).checked;
	}

	static disableAutomatic()
	{
		jQuery('#runAutomaticallyChb').get(0).checked = false;
	}
}