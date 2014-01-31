class BubbleChart
  constructor: (data) ->
    @data = data
    @width = 990
    @height = 375

    @tooltip = CustomTooltip("choix_tooltip", 240)

    # locations the nodes will move towards
    # depending on which view is currently being
    # used
    @center = {x: @width / 2, y: @height / 2}
    @choix_centers = {
      "": {x: -@width / 10, y: -@height / 10},
      "contre": {x: @width / 3, y: @height / 2},
      "abstention": {x: @width / 2, y: @height / 2},
      "pour": {x: 2 * @width / 3, y: @height / 2}
    }
    @parti_centers = {
      "NPA": {x: @width / 5, y: @height / 3},
      "PC": {x: @width / 5, y: @height / 3},
      "PG": {x: @width / 5, y: @height / 3},
      "EELV": {x: 2*@width / 5, y: @height / 3},
      "PS": {x: 3*@width / 5, y: @height / 3}
      "Walwari": {x: 4*@width / 5, y: @height / 3},
      "MoDem": {x: @width / 5, y: 2*@height / 3},
      "RS": {x: 2 * @width / 5, y: 2*@height / 3}
      "NC": {x: 2 * @width / 5, y: 2*@height / 3}
      "PRV": {x: 2 * @width / 5, y: 2*@height / 3}
      "UMP": {x: 3*@width / 5, y: 2*@height / 3},
      "DLR": {x: 3.6*@width / 5, y: 2*@height / 3},
      "FN": {x: 4.1*@width / 5, y: 2*@height / 3}
    }

    # used when setting up force and
    # moving around nodes
    @layout_gravity = -0.05
    @damper = 0.1

    # these will be set in create_nodes and create_vis
    @vis = null
    @nodes = []
    @force = null
    @circles = null

    # nice looking colors - no reason to buck the trend
    @fill_color = d3.scale.ordinal()
      .domain(["NPA","PC","PG","EELV","Walwari","PS","MoDem","NC","RS","PRV","UMP","DLR","FN"])
      .range(["#d40000","#d40000","#d40000","#608a32","#f96996","#d41066","#f56a20","#5bc1f4","#2e91db","#2e91db","#2c59a8","#7a0177","#04103f"])

    # use the max total_amount in the data as the max in the scale's domain
    max_amount = d3.max(@data, (d) -> parseInt(d.total_amount))
    @radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 25])
    
    this.create_nodes()
    this.create_vis()

  # create node objects from original data
  # that will serve as the data behind each
  # bubble in the vis, then add each node
  # to @nodes to be used later
  create_nodes: () =>
    @data.forEach (d) =>
      node = {
        id: d.id
        radius: @radius_scale(parseInt(d.total_amount))
        value: d.total_amount
        nom: d.nom
        fonction: d.fonction
        parti: d.parti
        maastricht: d.maastricht
        tce: d.tce
        lisbonne: d.lisbonne
        traite: d.traite
        nom_simple: d.nom_simple
        x: Math.random() * 990
        y: Math.random() * 450
      }
      @nodes.push node

    @nodes.sort (a,b) -> b.value - a.value


  # create svg at #vis and then 
  # create circle representation for each node
  create_vis: () =>
    @vis = d3.select("#vis").append("svg")
      .attr("width", @width)
      .attr("height", @height)
      .attr("id", "svg_vis")

    @circles = @vis.selectAll("circle")
      .data(@nodes, (d) -> d.id)

    @legends = @vis.selectAll("text")
      .data(@nodes, (d) -> d.id)

    # used because we need 'this' in the 
    # mouse callbacks
    that = this

    # radius will be set to 0 initially.
    # see transition below
    @circles.enter().append("circle")
      .attr("r", 0)
      .attr("fill", (d) => @fill_color(d.parti))
      .attr("stroke-width", 1)
      .attr("stroke", (d) => d3.rgb(@fill_color(d.parti)).darker())
      .attr("id", (d) -> "bubble_#{d.id}")
      .attr("opacity", 0.8)
      .on("mouseover", (d,i) -> that.show_details(d,i,this))
      .on("mouseout", (d,i) -> that.hide_details(d,i,this))

    @legends.enter().append("text")
      .attr("class","legends")
      .attr("text-anchor","middle")
      .attr("dx",-10)
      .attr("dy",-10)
      .attr("fill", d3.rgb("#333"))
      .attr("id", (d) -> "text_#{d.id}")
      .text((d) -> d.nom_simple)
      .on("mouseover", (d,i) -> that.show_details(d,i,this))
      .on("mouseout", (d,i) -> that.hide_details(d,i,this))

    # Fancy transition to make bubbles appear, ending with the
    # correct radius
    @circles.transition().duration(2000).attr("r", (d) -> d.radius)
	
  # Charge function that is called for each node.
  # Charge is proportional to the diameter of the
  # circle (which is stored in the radius attribute
  # of the circle's associated data.
  # This is done to allow for accurate collision 
  # detection with nodes of different sizes.
  # Charge is negative because we want nodes to 
  # repel.
  # Dividing by 8 scales down the charge to be
  # appropriate for the visualization dimensions.
  charge: (d) ->
    -Math.pow(d.radius, 2.0) / 6

  # Starts up the force layout with
  # the default values
  start: () =>
    @force = d3.layout.force()
      .nodes(@nodes)
      .size([@width, @height])

  # Sets up force layout to display
  # all nodes in one circle.
  display_group_all: () =>
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_center(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
    @force.start()
    this.hide_legend()

  # Moves all circles towards the @center
  # of the visualization
  move_towards_center: (alpha) =>
    (d) =>
      d.x = d.x + (@center.x - d.x) * (@damper + 0.02) * alpha
      d.y = d.y + (@center.y - d.y) * (@damper + 0.02) * alpha

  # sets the display of bubbles to be separated
  # into each year. Does this by calling move_towards_year
  display_by_choix: (choix) =>
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_choix(e.alpha,choix))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) => d.y)		
        @legends.each(this.move_towards_choix(e.alpha,choix))
          .attr("x", (d) -> d.x+12)
          .attr("dy", (d) => d.y+3)
    @force.start()
    this.hide_legend()
    if choix == "traite"
      this.display_legend_nspp()
    else if choix == "lisbonne"
      this.display_legend_nppv()
    else
      this.display_legend()

  # move all circles to their associated @choix_centers 
  move_towards_choix: (alpha,choix) =>
    (d) =>
      if choix == "maastricht"
        target = @choix_centers[d.maastricht]
      else if choix == "tce"
        target = @choix_centers[d.tce]
      else if choix == "lisbonne"
        target = @choix_centers[d.lisbonne]
      else if choix == "traite"
        target = @choix_centers[d.traite]
      d.x = d.x + (target.x - d.x) * (@damper + 0.02) * alpha * 0.8
      d.y = d.y + (target.y - d.y) * (@damper + 0.02) * alpha * 0.8


  display_by_parti: () =>
    @force.gravity(@layout_gravity)
      .charge(this.charge)
      .friction(0.9)
      .on "tick", (e) =>
        @circles.each(this.move_towards_parti(e.alpha))
          .attr("cx", (d) -> d.x)
          .attr("cy", (d) -> d.y)
        @legends.each(this.move_towards_parti(e.alpha))
          .attr("x", (d) -> d.x+15)
          .attr("dy", (d) -> d.y+3)
    @force.start()
    this.hide_legend()
    this.display_partis()

  move_towards_parti: (alpha) =>
    (d) =>
      target = @parti_centers[d.parti]
      d.x = d.x + (target.x - d.x) * (@damper + 0.02) * alpha * 1.1
      d.y = d.y + (target.y - d.y) * (@damper + 0.02) * alpha * 1.1

  # Method to display year titles
  display_legend: () =>
    years_x = {"NON": @width / 4, "OUI": 3*@width / 4}
    years_data = d3.keys(years_x)
    years = @vis.selectAll(".legend")
      .data(years_data)

    years.enter().append("text")
      .attr("class", "legend")
      .attr("x", (d) => years_x[d] )
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text((d) -> d)

  display_legend_nspp: () =>
    years_x = {"NON": @width / 4, "OUI": 3*@width / 4, "ne s'est pas prononcé": @width/2}
    years_data = d3.keys(years_x)
    years = @vis.selectAll(".legend")
      .data(years_data)

    years.enter().append("text")
      .attr("class", "legend")
      .attr("x", (d) => years_x[d] )
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text((d) -> d)

  display_legend_nppv: () =>
    years_x = {"NON": @width / 4, "OUI": 3*@width / 4, "n'a pas pris part au vote": @width/2}
    years_data = d3.keys(years_x)
    years = @vis.selectAll(".legend")
      .data(years_data)

    years.enter().append("text")
      .attr("class", "legend")
      .attr("x", (d) => years_x[d] )
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text((d) -> d)

  display_partis: () =>
    partis_x = {"NPA - PC - PG": @width / 5,"EELV":  1.9*@width / 5,"PS":  3.2*@width / 5,"Walwari":  4.5*@width / 5,"MoDem":  0.9*@width / 5,"RS - NC - PRV":  2.1 * @width / 5,"UMP":  3.2*@width / 5,"DLR":  4*@width / 5,"FN":  4.5*@width / 5}
    partis_y = {"NPA - PC - PG": @height / 2,"EELV": @height / 2,"PS": @height / 2,"Walwari": @height / 2,"MoDem":  430,"RS - NC - PRV":  430,"UMP":  430,"DLR":  430,"FN":  430}

    partis_data = d3.keys(partis_x)
    partis = @vis.selectAll(".legend")
      .data(partis_data)
	
    partis.enter().append("text")
      .attr("class","legend")
      .attr("x", (d) => partis_x[d])
      .attr("y", (d) => partis_y[d])
      .attr("text-anchor","end")
      .text((d) -> d)

  # Method to hide year titiles
  hide_legend: () =>
    legend = @vis.selectAll(".legend").remove()

  show_details: (data, i, element) =>
    content = "<div class=\"title\"> #{data.nom}</div>"
    content +="<span class=\"value\"> #{data.fonction} (#{data.parti})</span><br/><ul style=\"list-style:none inside;margin-left:2px\">"
    if data.maastricht == "pour"
      content +="<li class=\"value\"><img src='images/vert.png' /> pour le traité de Maastricht</li>"
    if data.maastricht == "contre"
      content +="<li class=\"value\"><img src='images/rouge.png' /> contre le traité de Maastricht</li>"
    if data.tce == "pour"
      content +="<li class=\"value\"><img src='images/vert.png' /> pour le traité constitutionnel</li>"
    if data.tce == "contre"
      content +="<li class=\"value\"><img src='images/rouge.png' /> contre le traité constitutionnel</li>"
    if data.lisbonne == "pour"
      content +="<li class=\"value\"><img src='images/vert.png' /> pour le traité de Lisbonne</li>"
    if data.lisbonne == "contre"
      content +="<li class=\"value\"><img src='images/rouge.png' /> contre le traité de Lisbonne</li>"
    if data.lisbonne == "abstention"
      content +="<li class=\"value\"><em><img src='images/gris.png' /> n'a pas pris part au vote sur le traité de Libsonne</em></li>"
    if data.traite == "pour"
      content +="<li class=\"value\"><img src='images/vert.png' /> pour le traité budgétaire</li>"
    if data.traite == "contre"
      content +="<li class=\"value\"><img src='images/rouge.png' /> contre le traité budgétaire</li>"
    if data.traite == "abstention"
      content +="<li class=\"value\"><em><img src='images/gris.png' /> ne s'est pas prononcé sur le TSCG</em></li>"
    content +="</ul>"
    @tooltip.showTooltip(content,d3.event)

  hide_details: (data, i, element) =>
    @tooltip.hideTooltip()

root = exports ? this

$ ->
  chart = null

  render_vis = (csv) ->
    chart = new BubbleChart csv
    chart.start()
    root.display_all()
  root.display_all = () =>
    chart.display_by_choix("traite")
  root.display_choix = (view_type) =>
    chart.display_by_choix(view_type)
  root.toggle_view = (view_type) =>
      root.display_choix(view_type)

  d3.csv "data/choix.csv", render_vis