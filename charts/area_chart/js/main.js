// Config
const margin = {top: 100, right: 100, bottom: 100, left: 100}
const width = 600, height = 400

const g = d3.select("#chart-area")
	.append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

// Scales
const x = d3.scaleTime().range([0, width])
const y = d3.scaleLinear().range([0, height])

// Axis
const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d => d3.format("(.2f")(d))
const xAxis = d3.axisBottom(x).ticks(5)
const y_axis = g.append("g").attr("class", "y axis")
const x_axis = g.append("g").attr("class", "x axis").attr("transform", "translate(0, " + height + ")")

// Y-Axis label
const y_label = y_axis.append("text")
	  .attr("class", "axis-title")
    .attr("y", 6)
    .attr("transform", "rotate(-90)")
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")

// Time Format
const parseDate = d3.timeParse("%d-%b-%y")

// Obtain Data
// ***********
d3.tsv("https://raw.githubusercontent.com/gcastillo56/d3Lab/master/charts/area_chart/data/area.tsv").then(data => {
  parse(data)

  // Init Variabes
  const y_data = "close", x_data = "date"
  const y_max = d3.max(data, d => d[y_data])
  const x_ranges = d3.extent(data, d => d[x_data])
  y.domain([y_max, 0])
  x.domain(x_ranges)

  // Area Chart
  const area = d3.area()
    .x(d => x(d[x_data]))
  	.y0(y(0))
    .y1(d => y(d[y_data]))

  g.append("path")
    .attr("fill", "#CCE5DF")
    .attr("stroke", "#69B3A2")
    .attr("stroke-width", 1.5)
  	.attr("d", area(data))

  configAxisAndLabels(x, y, "Price ($)", "#000")


}).catch(error => print(error))

// Config Axis
// ***********
function configAxisAndLabels(x, y, yLabel, color) {

	// Y Axis
	y_axis.call(yAxis).selectAll("text").style("fill", color)

	// X Axis
	x_axis.call(xAxis).selectAll("text").style("fill", color)
		.attr("y", "10").attr("x", "-5")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-45)")

	// Axis Color
	g.selectAll(".y.axis line").style("stroke", color)
	g.selectAll(".y.axis path").style("stroke", color)
	g.selectAll(".x.axis line").style("stroke", color)
	g.selectAll(".x.axis path").style("stroke", color)

  // Label
  y_label.text(yLabel).style("fill", color)

}

// Parse Integers
// **************
function parse(data) {
  data.forEach(item => {
    Object.keys(item).forEach(curr => {
      if (!isNaN(item[curr])) item[curr] = parseFloat(item[curr])
			if (curr === "date") item[curr] = parseDate(item[curr])
    })
  })
  return data
}

// NOTES:
// https://github.com/d3/d3-scale-chromatic
