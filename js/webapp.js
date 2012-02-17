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
	speed = 400;
var names = new Array,
	rowPos = new Array,
	rowSize = new Array,
	years = new Array;
for(i=0;i<xmlDoc.documentElement.getElementsByTagName("data")[1].getElementsByTagName("record").length;i++){
	years[i] = xmlDoc.documentElement.getElementsByTagName("data")[1].getElementsByTagName("record")[i].getElementsByTagName("field")[2].textContent;
}
var rectColors = new Array('#ff2261','#8ac035','#3abcde');

/* ready? go! */
$(document).ready(function(){
	paper = new Raphael(document.getElementById('canvas_1'), windowW, windowH);
	drawRows();
});

/* initialize */
function drawRows(){
	// create group
	years[year] = xmlDoc.documentElement.getElementsByTagName("data")[1].getElementsByTagName("record")[year].getElementsByTagName("field")[2].textContent;
	window[years[year]] = paper.set();
	

	
	// create objects
	if (state == 'interactive' || state == 'complete'){		
		for(i=0;i<xmlDoc.documentElement.getElementsByTagName("data").length;i++){	
			names[i] = xmlDoc.documentElement.getElementsByTagName("data")[i].attributes.getNamedItem("type").nodeValue;			
			// draw rectangle and add name property
			window[names[i]] = paper.rect(Math.round(windowW/years.length*year),0,Math.round(windowW/years.length),windowH);
			window[names[i]].name = names[i];
			window[years[year]].push(window[names[i]]);
		}		
	addStyles();	
	animRows();
	}
	window[years[year]].attr({
		cursor: 'pointer'
		}).mouseover(function(e){
		    this.attr('fill', color_hover);
		});
}
function addStyles(){
	for(i=0;i<names.length;i++){
		window[names[i]].attr({'fill':rectColors[i],'stroke-width':0});
	}
}
function calcSizes(theyear){
	for(i=0;i<names.length;i++){
		// pass height
		rowSize[i] = xmlDoc.documentElement.getElementsByTagName("data")[i].getElementsByTagName("record")[theyear].getElementsByTagName("field")[3].textContent*windowH/100;
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
	//console.log(year);
	calcSizes(year);	
	// print date
	//$('.year').html(xmlDoc.documentElement.getElementsByTagName("data")[1].getElementsByTagName("record")[year].getElementsByTagName("field")[2].textContent);
	
	for(i=0;i<names.length;i++){
		window[names[i]].animate({'y':Math.round(rowPos[i])}, speed, 'backOut');
//		window[names[i]].animate({'height':rowSize[i]}, speed-init/2, '<');
	}
	setTimeout(function(){
		year += 1;
		if(year==years.length){
			clearTimeout();
		} else {
			drawRows();
		}
	},speed*.2);
}

var color_hover = 'black';

/*
var on = function(){
	this.attr({'fill':'black'});
}

function addAction(){
	for(i=0;i<years.length;i++){
		window[years[i]].forEach(function(){
			console.log(this);
			window[years[i]].hover(on);
		});
	}
}
*/