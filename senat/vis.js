var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

var jours = [{name:'lundi',abbr:'L'},{name:'mardi',abbr:'Ma'},{name:'mercredi',abbr:'Me'},{name:'jeudi',abbr:'J'},{name:'vendredi',abbr:'V'},{name:'samedi',abbr:'S'},{name:'dimanche',abbr:'D'}]
var journee = ['matin','après-midi']
var browser = BrowserDetect;

var chiffres = [
	{matin:[1,1,1,1,1,1,0],am:[1,1,1,1,1,1,0],annee:"avant 1882",jours_semaine:6,heures_semaine:"",jours_annee:"",heures_annee:""},
	{matin:[1,1,1,0,1,1,0],am:[1,1,1,0,1,1,0],annee:1882,jours_semaine:5,heures_semaine:"",jours_annee:"",heures_annee:""},
	{matin:[1,1,1,0,1,1,0],am:[1,1,1,0,1,1,0],annee:1894,jours_semaine:5,heures_semaine:30,jours_annee:223,heures_annee:1338},
	{matin:[1,1,1,0,1,1,0],am:[1,1,1,0,1,1,0],annee:1922,jours_semaine:5,heures_semaine:30,jours_annee:213,heures_annee:1278},
	{matin:[1,1,1,0,1,1,0],am:[1,1,1,0,1,1,0],annee:1938,jours_semaine:5,heures_semaine:30,jours_annee:188,heures_annee:1128},
	{matin:[1,1,1,0,1,1,0],am:[1,1,1,0,1,0,0],annee:1966,jours_semaine:4.5,heures_semaine:30,jours_annee:180,heures_annee:1080},
	{matin:[1,1,1,0,1,1,0],am:[1,1,1,0,1,0,0],annee:1969,jours_semaine:4.5,heures_semaine:27,jours_annee:180,heures_annee:975},
	{matin:[1,1,0,1,1,1,0],am:[1,1,0,1,1,0,0],annee:1972,jours_semaine:4.5,heures_semaine:27,jours_annee:180,heures_annee:975},
	{matin:[1,1,0,1,1,1,0],am:[1,1,0,1,1,0,0],annee:1989,jours_semaine:4.5,heures_semaine:26,jours_annee:180,heures_annee:975},
	{matin:[1,1,0,1,1,0,0],am:[1,1,0,1,1,0,0],annee:2008,jours_semaine:4,heures_semaine:24,jours_annee:144,heures_annee:864},
	{matin:[1,1,1,1,1,0,0],am:[1,1,0,1,1,0,0],annee:2013,jours_semaine:4.5,heures_semaine:24,jours_annee:144,heures_annee:864},
];

function createTiles() {

	var html = '<table id="tiles" class="front">';

	html += '<tr><th><div>&nbsp;</div></th>';

	for (var h = 0; h < jours.length; h++) {
		html += '<th class="j' + h + '">' + jours[h].abbr + '</th>';
	}
	
	html += '</tr>';

	for (var d = 0; d < journee.length; d++) {
		html += '<tr class="d' + d + '">';
		html += '<th>' + journee[d] + '</th>';
		for (var h = 0; h < jours.length; h++) {
			html += '<td id="d' + d + 'h' + h + '" class="d' + d + ' h' + h + '"><div class="tile"><div class="face front"></div><div class="face back"></div></div></td>';
		}
		html += '</tr>';
	}
	
	html += '</table>';
	d3.select('#vis').html(html);

	var side = d3.select('#tiles').attr('class');
	
	for (var h = 0; h < 7; h++) {
		
		var sel = '#d' + 0 + 'h' + h + ' .tile .' + side,
		val = chiffres[0].matin[h];
		
		// erase all previous bucket designations on this cell
		for (var i = 1; i <= 2; i++) {
			var cls = 'q' + i + '-' + 2;
			d3.select(sel).classed(cls , false);
		}
			
		// set new bucket designation for this cell
		if(chiffres[0].matin[h] == 1) var cls = 'q' + 1 + '-' + 1;
		else var cls = 'q' + 1 + '-' + 2;
				
		d3.select(sel).classed(cls, true);

		var sel = '#d' + 1 + 'h' + h + ' .tile .' + side,
		val = chiffres[0].am[h];
		
		// erase all previous bucket designations on this cell
		for (var i = 1; i <= 2; i++) {
			var cls = 'q' + i + '-' + 2;
			d3.select(sel).classed(cls , false);
		}
			
		// set new bucket designation for this cell
		if(chiffres[0].am[h] == 1) var cls = 'q' + 1 + '-' + 1;
		else var cls = 'q' + 1 + '-' + 2;

		d3.select(sel).classed(cls, true);

	}
				
	$("#annee").html(chiffres[0].annee);
		
	var legende = "<p class=\"txt15\"><span id=\"jours_semaine\" class=\"tt17_capital\" style=\"display:inline\">"+chiffres[0].jours_semaine+"</span> jours travaillés par semaine";
	if(chiffres[0].heures_semaine != '') legende += ",<br /> soit un temps de travail hebdomadaire de <span id=\"heures_semaine\">"+chiffres[0].heures_semaine+"</span> heures.</p>";
	if(chiffres[0].jours_annee != '') legende += "<p class=\"txt15\"><span id=\"jours_annee\" class=\"tt17_capital\" style=\"display:inline\">"+chiffres[0].jours_annee+"</span> jours travaillés dans l'année";
	if(chiffres[0].heures_annee != '') legende += ",<br /> soit un temps annuel de travail de <span id=\"heures_annee\">"+chiffres[0].heures_annee+"</span> heures.";
	legende += "</p>";

	$("#legende").html(legende);
}

function reColorTiles(chiffre) {
	
	var data = chiffres[chiffre];
	var side = d3.select('#tiles').attr('class');
	
	if (side === 'front') {
		side = 'back';
	} else {
		side = 'front';
	}
	
	for (var h = 0; h < 7; h++) {
		
		var sel = '#d' + 0 + 'h' + h + ' .tile .' + side,
		val = data.matin[h];
		
		// erase all previous bucket designations on this cell
		for (var i = 1; i <= 2; i++) {
			var cls = 'q' + i + '-' + 2;
			d3.select(sel).classed(cls , false);
		}
			
		// set new bucket designation for this cell
		if(data.matin[h] == 1) var cls = 'q' + 1 + '-' + 1;
		else var cls = 'q' + 1 + '-' + 2;
			
		d3.select(sel).classed(cls, true);

		var sel = '#d' + 1 + 'h' + h + ' .tile .' + side,
		val = data.am[h];

		// erase all previous bucket designations on this cell
		for (var i = 1; i <= 2; i++) {
			var cls = 'q' + i + '-' + 2;
			d3.select(sel).classed(cls , false);
		}
			
		// set new bucket designation for this cell
		if(data.am[h] == 1) var cls = 'q' + 1 + '-' + 1;
		else var cls = 'q' + 1 + '-' + 2;
		
		$("#annee").html(data.annee);
				
		var html = "<p class=\"txt15\"><span id=\"jours_semaine\" class=\"tt17_capital\" style=\"display:inline\">"+data.jours_semaine+"</span> jours travaillés par semaine";
		if(data.heures_semaine != '') html += ",<br /> soit un temps de travail hebdomadaire de <span id=\"heures_semaine\">"+data.heures_semaine+"</span> heures.</p>";
		if(data.jours_annee != '') html += "<p class=\"txt15\"><span id=\"jours_annee\" class=\"tt17_capital\" style=\"display:inline\">"+data.jours_annee+"</span> jours travaillés dans l'année";
		if(data.heures_annee != '') html += ",<br /> soit un temps annuel de travail de <span id=\"heures_annee\">"+data.heures_annee+"</span> heures.</p>";
		
		$("#legende").html(html);
		
		d3.select(sel).classed(cls, true);
	}

	flipTiles();
}

function flipTiles() {

	var oldSide = d3.select('#tiles').attr('class'),
		newSide = '';
	
	if (oldSide == 'front') {
		newSide = 'back';
	} else {
		newSide = 'front';
	}
	
	var flipper = function(h, d, side) {
		return function() {
			var sel = '#d' + d + 'h' + h + ' .tile',
				rotateY = 'rotateY(180deg)';
			
			if (side === 'back') {
				rotateY = 'rotateY(0deg)';	
			}
			if (browser.browser === 'Safari' || browser.browser === 'Chrome') {
				d3.select(sel).style('-webkit-transform', rotateY);
			} else {
				d3.select(sel).select('.' + oldSide).classed('hidden', true);
				d3.select(sel).select('.' + newSide).classed('hidden', false);
			}
		};
	};
	
	for (var h = 0; h < jours.length; h++) {
		for (var d = 0; d < journee.length; d++) {
			var side = d3.select('#tiles').attr('class');
			setTimeout(flipper(h, d, side), (h * 20) + (d * 20) + (Math.random() * 100));
		}
	}
	d3.select('#tiles').attr('class', newSide);
}

createTiles();