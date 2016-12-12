"use strict";

class PlayAudioTaskController
{
	isMatching(cmdName)
	{
		return cmdName == "play_audio";
	}


	run(taskController, xmlElement, jqElement)
	{
		console.log(this);

		this.taskController = taskController;
		this.xmlElement = xmlElement;
		this.jqElement = jqElement;

		var url = xmlElement.find("param").attr("url");
		var waitForDone = (xmlElement.find("param").attr("wait_for_done") == 'true');

		var audio = new Audio(url);

		if(waitForDone == 'true')
		{
			audio.onended = this.done.bind(this);
			audio.play();
		}
		else
		{
			audio.play();
			this.done()
		}
	}



	done()
	{
		this.taskController.next();
	}


}

TaskController.Controllers.push(new PlayAudioTaskController());