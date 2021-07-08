// Config
// ******
const margin = {top: 10, right: 10, bottom: 100, left: 100}
const width = 600, height = 500

// Create SVG Canvas
// *****************
const g = d3.select("#chart-area")
	.append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

// Obtain Data
// ***********
d3.json("https://raw.githubusercontent.com/gcastillo56/d3Lab/master/projects/brewery/data/revenues.json").then(data => {
  read(data)

  // Init Variabes
	const data_bars = "revenue", data_labels = "month"
  const labels = data.map(d => d[data_labels])
  const max = d3.max(data, d => d[data_bars])
  const y = d3.scaleLinear().domain([max, 0]).range([0, height])
  const x = d3.scaleBand().domain(labels).range([0, height]).paddingInner(0.3).paddingOuter(0.3)

  // Add Bar Chart
  rect = g.selectAll("rect").data(data)
  rect.enter()
      .append("rect")
      .attr("x", (d, i) => x(d[data_labels]) + 20)
      .attr("y", d => y(d[data_bars]))
      .attr("width", d => x.bandwidth())
      .attr("height", d => height - y(d[data_bars]))
      .attr("fill", (d, i) => d3.interpolateBrBG(i/10 + 0.1) )

  configAxisAndLabels(x, y, "#fff", "Revenue (dlls.)", "Months")

}).catch(error => print(error))

// Config Axis & Labels
// **********************
function configAxisAndLabels(x, y, color, leftLabel, bottomLabel) {

	// Left Axis
	const leftAxis = d3.axisLeft(y).ticks(5).tickFormat(d => d + " m")
	g.append("g")
		.attr("class", "left axis")
		.call(leftAxis)
		.selectAll("text")
		.style("fill", color)

	// Bottom Axis
	const bottomAxis = d3.axisBottom(x)
	g.append("g")
		.attr("class", "bottom axis")
		.attr("transform", "translate(20, " + height + ")")
		.call(bottomAxis)
		.selectAll("text")
		.style("fill",color)
		.attr("y", "10")
		.attr("x", "-5")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-45)")

	// Axis Color
	g.selectAll(".bottom.axis line").style("stroke", color)
	g.selectAll(".bottom.axis path").style("stroke", color)
	g.selectAll(".left.axis line").style("stroke", color)
	g.selectAll(".left.axis path").style("stroke", color)

	// Left Label
	g.append("text")
		.attr("class", "y axis-label")
		.attr("x", - (height / 2))
		.attr("y", -70)
		.attr("font-size", "15px")
		.style("fill", color)
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text(leftLabel)

	// Bottom Label
	g.append("text")
		.attr("class", "x axis-label")
		.attr("x", (width / 2) - 70)
		.attr("y", height + 70)
		.attr("font-size", "15px")
		.style("fill", color)
		.text(bottomLabel)

}

// Parse Integers
// **************
function read(data) {
  data.forEach(item => {
    Object.keys(item).forEach(curr => {
      if (!isNaN(item[curr])) item[curr] = parseInt(item[curr])
    })
  })
  return data
}

// NOTES:
// https://github.com/d3/d3-scale-chromatic
