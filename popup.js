const rd_export = document.getElementById("rd_export");
rd_export.addEventListener("click",() => {
	chrome.tabs.query({active: true}, function(tabs){
		var tab = tabs[0];
		if(tab){
			chrome.scripting.executeScript({
				target: {tabId: tab.id, allFrames: true},
				func: parsingTest
			});
		}else{
			alert("There are no active tabs");
		}
	});
});

function parsingTest(){
    const testForm = document.querySelector("form.questionflagsaveform");
	let htmlcode = '<link rel="stylesheet" type="text/css" href="https://edu.rosdistant.ru/theme/styles.php/lambda/1698921777_1634732626/all" />'+"\n";
	htmlcode += testForm.outerHTML;
	html_save(htmlcode);
	
	function html_save(content = null, name = null, mime = null){
		if(content === undefined || content === null || content == "") return;
		name = (name === undefined || name === null) ? uuidv4() : name;
		mime = (mime === undefined || mime === null) ? {encoding: 'UTF-8', type: 'text/html;charset=UTF-8'} : mime;
		let blob = new Blob([content], mime);
		let url = window.URL.createObjectURL(blob);
		let a = document.createElement("a");
		a.download = name;
		a.style.display = 'none';
		a.href = url;
		a.click();
		window.URL.revokeObjectURL(url);
	}

	function uuidv4(){
		return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	}
}