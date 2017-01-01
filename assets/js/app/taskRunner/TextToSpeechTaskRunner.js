"use strict";

class TextToSpeechTaskRunner
{
	constructor()
	{
		this.SSU = new SpeechSynthesisUtterance();
		this.chooseRandomVoice();
		this.SSU.onend = this.done.bind(this);
	}



	isMatching(model)
	{
		return model.type == "text_to_speech";
	}



	run(model)
	{
		this.model = model;

		this.SSU.text = model.param["text"];
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
		TasksList.next();
	}
}