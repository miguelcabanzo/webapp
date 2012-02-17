/* load and parse xml */
var xmlpath = "data/italy_fem.xml"
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", xmlpath, false);
xmlhttp.setRequestHeader('Content-Type', 'text/xml');
xmlhttp.send("");
var xmlDoc = xmlhttp.responseXML;
xmlDoc.onreadystatechange = CheckState();
/* everything's ok? */
var state;
var timerId = setTimeout(function(){
	if (state != 'interactive' && state != 'complete'){
		xmlDoc.abort();
		console.log("XML not loaded");
	}
}, 1000);
function CheckState(){
	state = xmlDoc.readyState;
	if (state == 'interactive' || state == 'complete'){
		clearTimeout(timerId);
		console.log("XML loaded");
	}
}

/* some global vars */
var windowW = $(window).width(),
	windowH = $(window).height();
var paper,
	newPos,
	year = 0,
	init,
	speed = 700;
var names = new Array,
	rowPos = new Array,
	rowSize = new Array;
var rectColors = new Array('#ff2261','#8ac035','#3abcde');

/* ready? go! */
$(document).ready(function(){
	paper = new Raphael(document.getElementById('canvas_1'), windowW, windowH);
	drawRows();
});

/* initialize */
function drawRows(){
	if (state == 'interactive' || state == 'complete'){		
		for(i=0;i<xmlDoc.documentElement.getElementsByTagName("data").length;i++){	
			names[i] = xmlDoc.documentElement.getElementsByTagName("data")[i].attributes.getNamedItem("type").nodeValue;			
			// draw rectangle and add name property
			window[names[i]] = paper.rect(0,0,windowW,windowH);
			window[names[i]].name = names[i];
		}		
	addStyles();
	animRows();
	}
}
function addStyles(){
	for(i=0;i<names.length;i++){
		window[names[i]].attr({'fill':rectColors[i],'stroke-width':0});
	}
}
function calcSizes(years){
	for(i=0;i<names.length;i++){
		// pass height
		rowSize[i] = xmlDoc.documentElement.getElementsByTagName("data")[i].getElementsByTagName("record")[years].getElementsByTagName("field")[3].textContent*windowH/100;
		// pass y pos
		if(i==0){
			rowPos[i] = 0;
		}
		if(i>0){
			rowPos[i] = rowSize[i-1]+rowPos[i-1];
		}
	}
}

function animRows(){
	calcSizes(year);
	// print date
	//$('.year').html(xmlDoc.documentElement.getElementsByTagName("data")[1].getElementsByTagName("record")[year].getElementsByTagName("field")[2].textContent);
	if(year==0){
		init = speed+1;
	} else {
		init = 0;
	}	
	for(i=0;i<names.length;i++){
		window[names[i]].animate({'y':rowPos[i]}, speed-init, 'backOut');
//		window[names[i]].animate({'height':rowSize[i]}, speed-init/2, '<');
	}	
	setTimeout(function(){
		animRows();
		year += 1;
	},500);
}