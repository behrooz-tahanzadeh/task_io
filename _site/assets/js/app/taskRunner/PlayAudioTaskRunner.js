"use strict";

class PlayAudioTaskRunner
{
	isMatching(model)
	{
		return model.type == "play_audio";
	}


	run(model)
	{
		var url = model.param["url"];
		var waitForDone = model.param["wait_for_done"] == 'true';

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
		TasksList.next();
	}


}