const rd_export = document.getElementById("rd_export");
const rd_pdf_export = document.getElementById("rd_pdf_export");
const rd_pdf_book = document.getElementById("rd_pdf_book");

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

rd_pdf_export.addEventListener("click",() => {
	chrome.tabs.query({active: true}, function(tabs){
		var tab = tabs[0];
		if(tab){
			chrome.scripting.executeScript({
				target: {tabId: tab.id, allFrames: true},
				func: parsingPdfTest
			});
		}else{
			alert("There are no active tabs");
		}
	});
});

rd_pdf_book.addEventListener("click",() => {
	chrome.tabs.query({active: true}, function(tabs){
		var tab = tabs[0];
		if(tab){
			chrome.scripting.executeScript({
				target: {tabId: tab.id, allFrames: true},
				func: parsingPdfBook
			});
		}else{
			alert("There are no active tabs");
		}
	});
});

function parsingTest(){
    const breadcrumbNav = document.querySelector("div.breadcrumb-nav");
    const testForm = document.querySelector("form.questionflagsaveform");
	let htmlcode = '<meta charset="utf-8" />'+"\n";
	htmlcode += '<link rel="stylesheet" type="text/css" href="https://edu.rosdistant.ru/theme/styles.php/lambda/1698921777_1634732626/all" />'+"\n";
	htmlcode += '<style>.formulation input[type="text"],.formulation select{min-width:300px;}</style>'+"\n";
	if(testForm && breadcrumbNav){
		htmlcode += breadcrumbNav.outerHTML + "\n";
		htmlcode += testForm.outerHTML;
		html_save(htmlcode);
	}
	
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

function parsingPdfTest(){
    const breadcrumbNav = document.querySelector("div.breadcrumb-nav");
    const testForm = document.querySelector("form.questionflagsaveform");
	let htmlcode = '<meta charset="utf-8" />'+"\n";
	htmlcode += '<link rel="stylesheet" type="text/css" href="https://edu.rosdistant.ru/theme/styles.php/lambda/1698921777_1634732626/all" />'+"\n";
	htmlcode += '<style>.formulation input[type="text"],.formulation select{min-width:300px;}</style>'+"\n";
	if(testForm && breadcrumbNav){
		htmlcode += breadcrumbNav.outerHTML + "\n";
		htmlcode += testForm.outerHTML;
		printPdf(htmlcode);
	}
	
	function printPdf(data){
		let iframe = document.createElement('iframe'),
			blob = new Blob([data], {type: "text/html; charset=utf-8"});
		document.body.appendChild(iframe);
		iframe.id = 'pdf_iframe_by_opiums';
		iframe.style.visibility = 'hidden';
		iframe.style.display = 'none';
		iframe.src = URL.createObjectURL(blob);
		iframe.onload = function(){
			setTimeout(function(){
				iframe.focus();
				iframe.contentWindow.print();
				URL.revokeObjectURL(blob);
				document.body.removeChild(iframe);
			}, 100);
		};
	}
}

function parsingPdfBook(){
	const docHTML = document.documentElement.outerHTML;
	if(document.querySelector('script[src="data/js/viewer.js"]') == null) return;
	if(docHTML.match(/var fileOpenParams = (.*);/) != null){
		let book = JSON.parse(docHTML.match(/var fileOpenParams = (.*);/)[1]);
		let passw = {};
		for(let k in localStorage){
			if(k.match(/ispring::book(.*)/) != null){
				let u = (typeof JSON.parse(JSON.parse(localStorage.getItem(k))) === "object") ? JSON.parse(JSON.parse(localStorage.getItem(k))).updated : 0;
				if(!passw.updated || passw.updated && u > passw.updated){
					passw.key = k.match(/ispring::book\/(.*)/)[1];
					passw.updated = JSON.parse(JSON.parse(localStorage.getItem(k))).updated;
				}
			}
		}
		if(passw.key != ""){
			let quest = confirm(passw.key);
			if(quest){
				const new_win = window.open(book.filePath, '_blank');
			}
		}
	}
}