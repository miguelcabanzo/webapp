$(function(){
	main();
});

function main()
{
	var ajaxurl = "data/italy_fem.xml", program, windowW = $(window).width(), windowH = $(window).height();
	
	program = {
	xml : '',
	rectColors : new Array('#ff2261','#8ac035','#3abcde'),
	years : new Array(),
	paper : paper = new Raphael(document.getElementById('canvas_1'), windowW, windowH),
	sets : {},
	speed : 400,
	year : 0,
	matchCount : 0,
	countYears : 0,
	names : new Array(),
	rows : new Array(),
	positions : new Array(),
	objects : {},
	init: function()
	{
		this.doRequest();
		
		$('#canvas_1').ajaxComplete(function()
		{
			program.years = program.fillYears();
			program.countYears = program.years.length;
			program.matchCount = program.xml.documentElement.getElementsByTagName("data").length;
			program.names = program.setNames();
			
			////console.log( program.xml );
			if( program.countYears > 0)
			{
				program.runDraw();
			}
		});
	},
	calcSizes : function(year)
	{
		var rowSize = new Array(), rowPos = new Array();
		for(i=0;i<program.names.length;i++){
			// pass height
			rowSize[i] = program.xml.documentElement.getElementsByTagName("data")[i].getElementsByTagName("record")[year].getElementsByTagName("field")[3].textContent*windowH/100;
			// pass y pos
			if(i==0){
				rowPos[i] = 0;
			}
			if(i>0){
				rowPos[i] = rowSize[i-1]+rowPos[i-1];
			}
		}
		return rowPos;
	},
	runDraw : function()
	{
		program.draw();
		
		setTimeout(function()
		{
			program.year++;
			
			if(program.year == program.countYears){
				clearTimeout();
				program.giveInteraction();
			} else {
				program.runDraw();
			}
		},program.speed*.2);
	},
	giveInteraction : function()
	{
		$.each(program.sets, function(i,s){
			s.attr({
				cursor: 'pointer'
			}).mouseover(function(event){
				s.attr('fill', "white");
			}).mouseout(function(event){
				$.each(s, function(i,s){
					s.attr({'fill':program.rectColors[i]})
				});
			});
		});
	},
	draw : function()
	{
		program.positions = program.calcSizes( program.year );
		program.sets[program.years[program.year]] = program.paper.set();
		//console.log( typeof program.sets[program.year] );
		for(i=0;i<program.matchCount;i++){			
			// draw rectangle and add name property
			program.objects[program.names[i]] = paper.rect(Math.round(windowW/program.years.length*program.year),0,Math.round(windowW/program.years.length),windowH);
			program.sets[program.years[program.year]].push(program.objects[program.names[i]]);
		}
		program.addStyles();
	},
	addStyles : function()
	{
		for(i=0;i<program.names.length;i++)
		{
			program.objects[program.names[i]].attr({'fill':program.rectColors[i],'stroke-width':0});
			program.objects[program.names[i]].animate({'y':Math.round(program.positions[i])}, program.speed, 'backOut');
		}
	},
	setNames : function()
	{
		var tmp = new Array();
		for(var i=0; i < program.matchCount; i++)
		{
			tmp[i] = program.xml.documentElement.getElementsByTagName("data")[i].attributes.getNamedItem("type").nodeValue;
		}
		return tmp;
	},
	fillYears : function()
	{
		var count = program.xml.documentElement.getElementsByTagName("data")[1].getElementsByTagName("record").length, tmp = new Array();
		for(i=0;i<count;i++)
		{
			if( program.xml.documentElement.getElementsByTagName("data")[1].getElementsByTagName("record")[i].getElementsByTagName("field")[3].textContent )
			tmp[i] = program.xml.documentElement.getElementsByTagName("data")[1].getElementsByTagName("record")[i].getElementsByTagName("field")[2].textContent;
		}
		return tmp;
	},
	doRequest:function ()
	{
		$.ajax({  
					type: 'get',  
					url: ajaxurl,  
					data: {'action': 'get_data' },
					dataType: 'xml',
					error: function(XMLHttpRequest, textStatus, errorThrown)
					{  
						//////////console.log( textStatus, errorThrown );
					},
					beforeSend: function(XMLHttpRequest) 
					{ 
						if (XMLHttpRequest && XMLHttpRequest.overrideMimeType) 
						{
						    XMLHttpRequest.overrideMimeType("text/xml;charset=UTF-8");
						}
					}, 
					success: function( data, textStatus, jqXHR )
					{
						//////////console.log( XMLHttpRequest, textStatus, jqXHR );
						if( data )
						{
							program.xml = data;
						}
					},
					complete: function( data, textStatus )
					{
						//////////console.log( data, textStatus );
					}  
				});
			}
		}
		program.init();
}