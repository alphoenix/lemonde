/** script thanks to Marc-Olivier Ricard, Pierre Romera et Jim Vallandingham **/
var donnees = []; 
var doc = new Gselper({
	key: "0AiWUhxLpQgUXdG5YQ3pNOE5fWDFVLVUxdXFrUWdIN2c",
	worksheet: "od6",

	onComplete: function() {
		$.each(doc.get(),function(i,line) {
			donnees.push(line);
		});
		
		var sum_pour = 0, sum_contre = 0, sum_hesite = 0;

		var graph = (function() {

			var w = 990,	//width
			h = 550,										//height
			m = 15,											//margin
			center_abst = {
				x: (w-m)/2,
				y: (h-m)/2
			},
			center_pour = {
				x: (w-m)/4,
				y: (h-m)/2
			},
			center_contre = {
				x: 3*(w-m)/4,
				y: (h-m)/2
			},
			o,				//opacity scale
			r,				//radius scale
			z,				//color scale
			g,				//gravity scale
			t = {			//time factors
				minutes : 1,
				hour    : 60,
				hours   : 60,
				day     : 1440,
				days    : 1440
			},
			gravity  = -0.04,	//gravity constants
			damper   = 0.2,
			friction = 0.6,
			force = d3			//gravity engine
			.layout
			.force()
			.size([w-m,h-m]),
			svg = d3			//container
			.select("#graph")
			.append("svg")
			.attr("height",h+"px")
			.attr("width",w+"px"),
			circles				//data representation
			tooltip = CustomTooltip( "posts_tooltip", 240 );

			function init(callback) {
				load(function() {
					launch();
					callback();
				});
			}

			function update(){
				launch();
			}

			function load(callback){
					posts = donnees;

					posts.map( function(d) {
						var comments = 12,
						taille = parseInt(d.taille);
//               		time     = d.time.split(" ");

						d.comments = comments ? comments : 0;
						d.taille = taille ? taille : 0;
//              		d.time = time[0] * t[ time[1] ]; // number * factor

						if(d.vote == "pour") sum_pour+=taille;
						if(d.vote == "contre") sum_contre+=taille;
//						if(d.vote == "hesite") sum_hesite+=taille;

						return d;
					});

					// Defining the scales
					r = d3.scale.linear()
					.domain([d3.min(posts,function(d) {return d.taille;}),
					d3.max(posts,function(d) {return d.taille;})])
					.range([7,150])
					.clamp(false);

					z = d3.scale.ordinal()
					.domain(["NI","GDR","PG","ECOLO","RRDP","SRC","MoDem","NC","RS","UDI","UMP","DLR","FN"])
					.range(["#999999","#d40000","#d40000","#608a32","#d41066","#f96996","#f56a20","#5bc1f4","#2e91db","#2e91db","#2c59a8","#7a0177","#04103f"])


					g = function(d) { return -r(d) * r(d) / 2.5; };

					callback();
			}

			function launch() {

				force
					.nodes(posts);

				circles = svg
					.append("g")
					.attr("id", "circles")
					.selectAll("a")
					.data(force.nodes());

				// Init all circles at random places on the canvas
				force.nodes().forEach(function(d, i){
					d.x = Math.random()*w;
					d.y = Math.random()*h;
				});

				var node = circles
				.enter()
				.append("a")
				//              .attr("xlink:href", function(d) { return d.url; })
				.append("circle")
				.attr("r", 0)
				.attr("cx", function(d) {return d.x;})
				.attr("cy", function(d) {return d.y;})
				.attr("fill", function(d) {return z(d.groupe);})
				.attr("stroke-width", 1)
				.attr("stroke", function(d) { return d3.rgb("#ffffff");})
				.attr("id",function(d) { return "post_#" + d.item_id; })
				.attr("title",function(d) { return d.title; })
				.attr("class",function(d) {return d.groupe;})
				.style("opacity",1)
				.on("mouseover",function(d, i) {force.resume();highlight(d,i,this);})
				.on("mouseout",function(d, i) {downlight(d,i,this);});

				d3.selectAll("circle")
				.transition()
				.delay(function(d, i) { return i*10; })
				.duration(10)
				.attr("r", function(d) { return r(d.taille); });

				loadGravity(moveCenter);

				//Loads gravity
				function loadGravity(generator) {
					force
					.gravity(gravity)
					.charge(function(d) {return g(d.taille);})
					.friction(friction)
					.on("tick", function(e) {
						generator(e.alpha);
						node
						.attr("cx", function(d) {return d.x; })
						.attr("cy", function(d) {return d.y; });
						}).start();
					}

					// Generates a gravitational point in the middle
					function moveCenter(alpha) {
						force.nodes().forEach(function(d) {
							if(d.vote == "pour") {
								d.x = d.x + (center_pour.x - d.x) * (damper + 0.02) * alpha;
								d.y = d.y + (center_pour.y - d.y) * (damper + 0.02) * alpha;
							}
							else if (d.vote == "contre") {
								d.x = d.x + (center_contre.x - d.x) * (damper + 0.02) * alpha;
								d.y = d.y + (center_contre.y - d.y) * (damper + 0.02) * alpha;
							}
							else if (d.vote == "abstention") {
								d.x = d.x + (center_abst.x - d.x) * (damper + 0.02) * alpha;
								d.y = d.y + (center_abst.y - d.y) * (damper + 0.02) * alpha;
							}
						});
					}
				}

				function highlight(data,i,element ) {
					d3.select( element ).attr( "stroke", "black" );

					var content = '<span class=\"title tt15_capital\">' + data.nom
					content += ' (' + data.département +')';
					content += '</span>';
					if(data.texte != null) content += '<p class=\"txt12\">' + data.texte +'</p>';

					tooltip.showTooltip(content, d3.event);
				}

				function downlight( data, i, element ) {
					d3.select(element).attr("stroke", function(d) { return d3.rgb("#ffffff"); });
				}

				//Register category selectors
				$("a.category").on("click", function(e) { update( $(this).attr("value") ); });

				return {
					categories : ["news", "best", "ask", "newest"],
					init : init,
					update : update
				};
				})();

				graph.init(function() {
					$("#sum_pour").html("("+sum_pour+" députés)");
					$("#sum_contre").html("("+sum_contre+" députés)");
				});

			}
});