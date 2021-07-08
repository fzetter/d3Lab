// MARGINS & GROUPS
// ****************

let margin = {top: 50, right: 100, bottom: 60, left: 100}
let width = 510
let height = 515

let g = d3.select("#chart-area")
	.append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")


// EXAMPLE GRAPH
// *************

let heights = [2500, 2000, 1500, 1000, 500]
let names = ["1", "2", "3", "4", "5"]
let rect = g.selectAll("rect").data(heights)

let max = d3.max(heights, d => d)
let y = d3.scaleLinear().domain([0, max]).range([0, 500])
let x = d3.scaleBand().domain(names).range([0, 500]).paddingInner(0.3).paddingOuter(0.2)

rect.enter()
    .append("rect")
    .attr("x", (d, i) => (i * x.bandwidth()*1.5) + 10 )
    .attr("y", d => 0)
    .attr("width", x.bandwidth())
    .attr("height", d => y(d) )
    .attr("fill", (d, i) => d3.interpolateViridis(i/10 + 0.2) )

// AXES
// ****

// LEFT
let leftAxis = d3.axisLeft(y)
g.append("g")
  .attr("class", "left axis")
  .call(leftAxis)

// RIGHT
let rightAxis = d3.axisRight(y)
g.append("g")
	.attr("class", "right axis")
	.attr("transform", "translate(" + width + ", 0)")
	.call(rightAxis)

// TOP
// const topAxis = d3.axisLeft(x)
// g.append("g")
// 	.attr("class", "top axis")
// 	.call(topAxis)

// BOTTOM
let bottomAxis = d3.axisBottom(x)
g.append("g")
	.attr("class", "bottom axis")
	.attr("transform", "translate(0, " + height+ ")")
	.call(bottomAxis)

// LABELS
// ******

// Y-Axis
g.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height / 2))
	.attr("y", -60)
	.attr("font-size", "15px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.style("fill","black")
	.text("Heights")

// X-Axis
g.append("text")
	.attr("class", "x axis-label")
	.attr("x", (width / 2))
	.attr("y", -20)
	.attr("font-size", "15px")
	.style("fill","black")
	.text("Buildings")

// EXERCISE
// ********

function read(data) {
  data.forEach(item => {
    Object.keys(item).forEach(curr => {
      if (!isNaN(item[curr])) item[curr] = parseInt(item[curr])
    })
  })
  return data
}

d3.json("https://raw.githubusercontent.com/gcastillo56/d3Lab/master/resources/data/buildings.json").then(data => {
  read(data)

  // Init Data
  heights = data.map(d => { return d.height })
  names = data.map(d => { return d.name })

  max = d3.max(data, d => d.height)
  y = d3.scaleLinear().domain([max, 0]).range([0, 400])
  x = d3.scaleBand().domain(names).range([0, 400]).paddingInner(0.3).paddingOuter(0.3)

  margin = {top: 10, right: 10, bottom: 100, left: 100}
  width = 600
  height = 500

  // Create SVG Canvas
  g = d3.select("#chart-area")
  	.append("svg")
  		.attr("width", width + margin.right + margin.left)
  		.attr("height", height + margin.top + margin.bottom)
  	.append("g")
  		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

  // Add Bar Chart
  rect = g.selectAll("rect").data(data)

  rect.enter()
      .append("rect")
      .attr("x", (d, i) => x(d.name) + 20)
      .attr("y", d => y(d.height))
      .attr("width", d => x.bandwidth())
      .attr("height", d => 400 - y(d.height))
      .attr("fill", (d, i) => d3.interpolateViridis(i/10 + 0.1) )

  // Left Axis
  leftAxis = d3.axisLeft(y).ticks(5).tickFormat(d => d + " m")
  g.append("g")
    .attr("class", "left axis")
    .call(leftAxis)

  // Bottom Axis
  bottomAxis = d3.axisBottom(x)
  g.append("g")
  	.attr("class", "bottom axis")
  	.attr("transform", "translate(20, " + (height - 80) + ")")
  	.call(bottomAxis)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-45)")

  // Left Label
  g.append("text")
  	.attr("class", "y axis-label")
  	.attr("x", - (height / 2))
  	.attr("y", -70)
  	.attr("font-size", "15px")
  	.attr("text-anchor", "middle")
  	.attr("transform", "rotate(-90)")
  	.style("fill","black")
  	.text("Heights (m)")

  // Bottom Label
  g.append("text")
  	.attr("class", "x axis-label")
  	.attr("x", (width / 2) - 170)
  	.attr("y", height + 70)
  	.attr("font-size", "15px")
  	.style("fill","black")
  	.text("The word's tallest buildings")

}).catch(error => print(error))
