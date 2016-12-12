function publishCommandPanel_onClick()
{
	var node = NodeModel.GetById(jQuery("#publishCommandPanel>select").val());
	
	var cmd = {};
	cmd.data = jQuery("#publishCommandPanel input").val();
	
	node.publishTopic.publish(new ROSLIB.Message(cmd));
}


window.onbeforeunload = function()
{
    return "Are you sure? Unsaved changes will be lost...";
}


function downloadDescFile_onClick()
{
	var blobArr = [new XMLSerializer().serializeToString(XmlReader.xmlReader.jq.get(0))];
	var blob = new Blob(blobArr, {type: "text/plain;charset=utf-8"});
	
	var d = new Date();
	
	saveAs(blob, d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+"-"+Date.now()+".xml");
}

function disableAutorun()
{
	jQuery('#runAutomaticallyChb').get(0).checked = false;
	return true;
}
