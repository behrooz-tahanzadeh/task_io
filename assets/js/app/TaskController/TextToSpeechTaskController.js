"use strict";

class TextToSpeechTaskController
{
	constructor()
	{
		this.SSU = new SpeechSynthesisUtterance();
		this.chooseRandomVoice();
		this.SSU.onend = this.done.bind(this);
	}



	isMatching(cmdName)
	{
		return cmdName == "text_to_speech";
	}



	run(taskController, xmlElement, jqElement)
	{
		console.log(this);

		this.taskController = taskController;
		this.xmlElement = xmlElement;
		this.jqElement = jqElement;

		this.SSU.text = xmlElement.find("param").attr("text");
		this.chooseRandomVoice()

		window.speechSynthesis.speak(this.SSU);

		return this;
	}


	chooseRandomVoice()
	{
		var v = Math.floor(Math.random()*3);
		
		switch(v)
		{
			case 0:
			case 1:
				this.SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Male'; })[0]
				this.SSU.lang = 'en-GB';
				break;
			case 2:
				this.SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google UK English Female'; })[0]
				this.SSU.lang = 'en-GB';
				break;
			case 3:
				this.SSU.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == 'Google US English'; })[0]
				this.SSU.lang = 'en-US';
				break;
		}

		return this;
	}



	done()
	{
		this.taskController.next();
	}
}

TaskController.Controllers.push(new TextToSpeechTaskController());