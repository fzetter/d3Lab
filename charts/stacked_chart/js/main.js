// Config
const margin = {top: 100, right: 210, bottom: 100, left: 90}
const width = 600, height = 400

const g = d3.select("#chart-area")
	.append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

// Scales
const x = d3.scaleTime().rangeRound([0, width])
const y = d3.scaleLinear().rangeRound([0, height])
const color_scale = d3.scaleOrdinal(d3.schemeSpectral[11])

// Parse & Formatters
const parseDate = d3.timeParse('%Y')
const formatSi = d3.format(".3s")
const formatNumber = d3.format(".1f")
const formatBillion = x => formatNumber(x / 1e9)

// Axis Generators
const yAxis = d3.axisLeft(y).tickFormat(formatBillion)
const xAxis = d3.axisBottom(x)
const y_axis = g.append("g").attr("class", "y axis")
const x_axis = g.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")")

// Y-Axis label
const y_label = y_axis.append("text")
	  .attr("class", "axis-title")
    .attr("y", 6)
    .attr("transform", "rotate(-90)")
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")

// Area Chart & Stack
const area = d3.area()
	.x(d => x(d.data.date))
	.y0(d => y(d[0]))
	.y1(d => y(d[1]))

const stack = d3.stack()
let columns

// Legend
const legend = g.append("g").attr("transform", "translate(" + (width + 170) + "," + (height - 210) + ")")


// Obtain Data
d3.csv('https://raw.githubusercontent.com/gcastillo56/d3Lab/master/charts/stacked_chart/data/stacked_area2.csv').then(data => {
    parse(data)

    // Config
    columns = data.columns.filter(key => key !== 'date')
    const max = d3.max(data, d => {
        const vals = d3.keys(d).map(key => key !== 'date' ? d[key] : 0)
        return d3.sum(vals)
    })

    x.domain(d3.extent(data, d => d.date))
    y.domain([max, 0])
    color_scale.domain(columns)

    // Stack Chart
    stack.keys(columns)
    	.order(d3.stackOrderNone)
    	.offset(d3.stackOffsetNone)

    const browser = g.selectAll('.browser')
    	.data(stack(data))
    	.enter().append('g')
    	.attr('class', d => 'browser ' + d.key)
    	.attr('fill-opacity', 0.5)

    browser.append('path')
    	.attr('class', 'area')
    	.attr('d', area)
    	.style('fill', d => color_scale(d.key))

    // Axis & Labels
    configAxisAndLabels(x, y, "Billions of liters", "#fff")

}).catch(error => console.log(error))

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

  // Legend
  columns.reverse().forEach((country, i) => {
  	const legendRow = legend.append("g").attr("transform", "translate(-15, " + ((i * 20)-30) + ")")
  	legendRow.append("rect")
  		.attr("width", 10)
  		.attr("height", 10)
  		.attr("fill", color_scale(country))
  	legendRow.append("text")
  	  .attr("class", "legend")
  		.attr("x", -10)
  		.attr("y", 10)
  		.attr("text-anchor", "end")
  		.style("text-transform", "capitalize")
  		.text(country)
  })

  g.selectAll(".legend").style("fill", color)

}

// Parse Integers
// **************
function parse(data) {
  data.forEach(item => {
    Object.keys(item).forEach(curr => {
      if (!isNaN(item[curr])) item[curr] = parseInt(item[curr])
			if (curr === "date") item[curr] = parseDate(item[curr])
    })
  })
  return data
}

// NOTES:
// https://github.com/d3/d3-scale-chromatic
