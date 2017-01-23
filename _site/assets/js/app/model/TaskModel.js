class TaskModel
{
	constructor()
	{
		this.type = undefined;
		this.title = undefined;
		this.param = {};
		this.generated = {};
	}



	initByXML(xml)
	{
		this.type = xml.attr("type");
		this.title = xml.attr("title");
		this.param = {};
		this.generated = {};

		var params = xml.find("param").get(0).attributes;

		for(var i=0; i<params.length; ++i)
			this.param[params[i].name] = params[i].value;

		try
		{
			var gens = xml.find("generated").get(0).attributes;

			for(var i=0; i<gens.length; ++i)
				this.generated[gens[i].name] = gens[i].value;
		}
		catch(e){this.generated = {};}

		return this;
	}



	initByJQ(jq)
	{
		this.jq = jq;
		this.type = this.jq.find("td:eq(1)").html();
		this.title = this.jq.find("td:eq(2)").html();
		this.param = {};
		this.generated = {};

		var keys = this.jq.find("td:eq(3)>b");
		var values = this.jq.find("td:eq(3)>span");

		for(var i=0; i<keys.length; ++i)
			this.param[keys.eq(i).html()] = values.eq(i).html();

		keys = this.jq.find("td:eq(4)>b");
		values = this.jq.find("td:eq(4)>span");

		for(var i=0; i<keys.length; ++i)
			this.generated[keys.eq(i).html()] = values.eq(i).html();

		return this;
	}



	update()
	{
		if(this.jq)
		{
			this.jq.find("td:eq(1)").html(this.type);
			this.jq.find("td:eq(2)").html(this.title);

			var str = "";

			for (var k in this.param)
				str+= `<b>${k}</b>:<span>${this.param[k]}</span><br>`;
			
			this.jq.find("td:eq(3)").html(str);

			str = "";

			for (var k in this.generated)
				str+= `<b>${k}</b>:<span>${this.generated[k]}</span><br>`;
			
			this.jq.find("td:eq(4)").html(str);
		}

		return this;
	}



	append(index)
	{
		//                    0 #       1 Type    2 Title   3 Param                  4 Generated
		this.jq = jQuery("<tr> <td></td> <td></td> <td></td> <td class='detail'></td> <td class='detail'></td> </tr>");
		
		if(index == undefined || index == -1)
			jQuery("div#tasks tbody").append(this.jq);
		else
		{
			jQuery(`div#tasks tbody>tr:eq(${index})`).after(this.jq);
			TasksList.renderNumbers();
		}

		this.update();
		return this;
	}
}