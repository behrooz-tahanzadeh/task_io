class Main
{
	static init()
	{
		Main.taskRunners = 
		[
			new PlayAudioTaskRunner(),
			new ConfirmTaskRunner(),
			new PublishCmdTaskRunner(),
			new SleepTaskRunner(),
			new TextToSpeechTaskRunner()
		];
	}
}



jQuery(document).ready(function()
{
	Main.init();
	TasksList.init();
	EditorPanel.render();
	CurrentTaskPanel.init();
	NetworkModel.init();
	NodeModel.init();
	NavigationPanel.init();
});

window.onbeforeunload = function()
{
    return "Are you sure? Unsaved changes will be lost...";
}