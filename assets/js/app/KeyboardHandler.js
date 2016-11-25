window.onkeyup = function(e)
{
	switch(e.keyCode)
	{
		case 38:
			e.ctrlKey && disableAutorun() && TaskController.taskController.prev()
			break;
			
		case 40:
			e.ctrlKey && disableAutorun() && TaskController.taskController.next();
			break;
			
		case 82:
			disableAutorun() &&  TaskController.taskController.run();
			break;
			
		default:
			console.log(e);
	}
		
};