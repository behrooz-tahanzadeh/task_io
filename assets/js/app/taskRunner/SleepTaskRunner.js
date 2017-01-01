"use strict";

class SleepTaskRunner
{
	isMatching(model)
	{
		return model.type == "sleep";
	}


	run(model)
	{
		this.model = model;
		
		var delayMS = parseFloat(model.param["delay_sec"])*1000;

		this.clearTimeout().setTimeout(delayMS);
	}


	clearTimeout()
	{
		clearTimeout(this.timeoutID);
		this.timeoutID = -1;
		return this;
	}


	setTimeout(delay)
	{
		setTimeout(this.timeoutCb.bind(this), delay);
	}


	timeoutCb()
	{
		this.timeoutID = -1;
		TasksList.next();
	}

	cancel()
	{
		this.clearTimeout();
	}
}