class TasksList
{
	static init()
	{
		TasksList.currentChangeSignal = new signals.Signal();
	}



	static renderNumbers()
	{

	}



	static onDbClick(e)
	{
		var jq = jQuery(e.target);

		var i = -1;

		if(jq.is("tr"))
			i = jq.index();
		else if(jq.parents("tr").length>0)
			i = jq.parents("tr").index();

		NavigationPanel.disableAutomatic();
		TasksList.setCurrent(i);
	}



	static setCurrent(i)
	{
		if(i != -1)
		{
			jQuery("#tasks tbody>tr").removeClass('currentTask');
			jQuery("#tasks tbody>tr:eq("+i+")").addClass('currentTask');
			TasksList.currentChangeSignal.dispatch();
		}
	}



	static getCurrent()
	{
		var obj = jQuery("#tasks tbody>tr.currentTask");

		if(obj.length<=0)
			return -1
		else
			return obj.index();
	}



	static next()
	{TasksList.jump(+1);}



	static prev()
	{TasksList.jump(-1);}




	static jump(s)
	{
		if(s == 0)
		{
			console.log("0 jump can make infinite loop! disable autorun...");
			NavigationPanel.disableAutomatic();
		}
		else
		{
			var i = TasksList.getCurrent();

			if(i+s >= 0 && i+s < jQuery("#tasks tbody>tr").length)
				this.setCurrent(i+s);
		}
	}
}