class CurrentTaskPanel
{
	static init()
	{
		TasksList.currentChangeSignal.add(CurrentTaskPanel.onCurrentChange);
	}

	static onCurrentChange()
	{
		jQuery("#currentTaskPanel>div").html
		(
			jQuery("#tasks tbody>tr.currentTask").html().replace(new RegExp("td", 'g'), "div")
		);
	}
}