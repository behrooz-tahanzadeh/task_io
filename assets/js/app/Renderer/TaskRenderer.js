class TaskRenderer
{
	static Index(index)
	{
		var xmlElement = XmlReader.xmlReader.jq.find("tasks>task:eq("+index+")");
		var jq = jQuery("div#tasks tbody>tr:eq("+index+")");

		jq.find("td:eq(0)").html(index);
		jq.find("td:eq(1)").html(xmlElement.attr("type"));
		jq.find("td:eq(2)").html(xmlElement.attr("title"));
		
		var params = xmlElement.find("param").get(0).attributes;
		var str = "";
		for(var j=0; j<params.length; ++j)
			str+= "<b>"+params[j].name+": </b>"+params[j].value+"<br>";
		
		jq.find("td:eq(3)").html(str);

		try
		{
			var gens = xmlElement.find("generated").get(0).attributes;

			str = "";
			for(var j=0; j<gens.length; ++j)
				str+= "<b>"+gens[j].name+": </b>"+gens[j].value+"<br>";

			jq.find("td:eq(4)").html(str);
		}
		catch(e)
		{
			jq.find("td:eq(4)").html("_");	
		}
	}
}