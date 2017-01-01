
class EditorPanel
{
	static getType()
	{
		return jQuery("#editorPanel_type").val();
	}

	static getParam()
	{
		var type = EditorPanel.getType();
		var param = {};
		var jq = jQuery("#editorPanel_editors_"+type+" *[name]");

		for(var i = 0; i<jq.length; ++i)
			param[jq.eq(i).attr('name')] = jq.eq(i).val();
		
		return param;
	}

	static typeOnChange()
	{
		EditorPanel.render();
	}

	static render()
	{
		var type = EditorPanel.getType();
		jQuery("#editorPanel>.editors>div").addClass('hide');
		jQuery("#editorPanel_editors_"+type).removeClass('hide');
	}

	static addNew()
	{
		var type = EditorPanel.getType();
		var title = "";
		var param = EditorPanel.getParam();

		//                    0 #       1 Type    2 Title   3 Param                  4 Generated
		var jq = jQuery("<tr> <td></td> <td></td> <td></td> <td class='detail'></td> <td class='detail'></td> </tr>");

		//jq.attr("ondblclick", "jQuery('#runAutomaticallyChb').get(0).checked = false; TaskController.taskController.setIndex("+i+")")

		jq.find("td:eq(1)").html(type);
		jq.find("td:eq(2)").html(title);

		var str = "";

		for (var k in param)
			str+= "<b>"+k+": </b><span>"+param[k]+"</span><br>";
		
		jq.find("td:eq(3)").html(str);

		jQuery("div#tasks tbody").append(jq);
	}
}