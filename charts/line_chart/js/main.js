// Nests
// *****
let yields = [
	{yield: 27.00, variety: "Manchuria", year: 1931, site: "University Farm"},
	{yield: 48.87, variety: "Manchuria", year: 1931, site: "Waseca"},
	{yield: 27.43, variety: "Manchuria", year: 1931, site: "Morris"},
]

let byYear = d3.nest().key(d => d.year).entries(yields)
let byYearVariety = d3.nest().key(d => d.year).key(d => d.variety).entries(yields)

console.log(byYear)
console.log(byYearVariety)

// Config
// ******
const margin = {left: 80, right: 100, top: 50, bottom: 100}
const width = 800, height = 400

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
const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y).ticks(4).tickFormat(d => parseInt(d / 1000) + "k")
const y_axis = g.append("g").attr("class", "y axis")
const x_axis = g.append("g").attr("class", "x axis").attr("transform", "translate(0, " + height + ")")

// Time Format
const parseDate = d3.timeParse("%Y")
const formatDate = d3.timeFormat("%Y")
const bisectDate = d3.bisector(d => d.year).left

// Labels
y_axis.append("text")
	.attr("class", "axis-title")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .attr("fill", "#5D6971")
  .text("Population)")

// DATA
// *****
d3.json("https://raw.githubusercontent.com/gcastillo56/d3Lab/master/charts/line_chart/data/example.json").then(data => {
    parse(data)

    // Scale Domains
    const y_data = "value", x_data = "year"

    const x_ranges = d3.extent(data, d => d[x_data])
		const y_max = d3.max(data, d => d[y_data])
		x.domain(x_ranges)
    y.domain([y_max, 765*1000])

		// Line Chart
		const line = d3.line()
		  .x(d => x(d[x_data]))
		  .y(d => y(d[y_data]))

		g.append("path")
		  .attr("class", "line")
		  .attr("fill", "none")
		  .attr("stroke", "grey")
		  .attr("stroke-with", "3px")
		  .attr("d", line(data))

    // Axis & Labels
		x_axis.call(xAxis)
		y_axis.call(yAxis)

		// Focus
		const focus = g.append("g")
				.attr("class", "focus")
				.style("display", "none")

		// Append x line
		focus.append("line")
				.attr("class", "x-hover-line hover-line")
				.attr("y1", 0)
				.attr("y2", height)
				.style("opacity", 0.7)

		// Append y line
		focus.append("line")
				.attr("class", "y-hover-line hover-line")
				.attr("x1", 0)
				.attr("x2", width)
				.style("opacity", 0.7)

	  // Append circle at intersection
		focus.append("circle")
				.attr("r", 7.5)

	  // Append y-data at intersection
		focus.append("text")
			  .attr("class", "txt1")
				.attr("x", 15)
				.attr("dy", ".31em")

		// Append x-data at intersection
		focus.append("text")
			  .attr("class", "txt2")
				.attr("x", 15)
				.attr("dy", "1.5em")

		// Capture mouse
		g.append("rect")
				.attr("class", "overlay")
				.attr("width", width)
				.attr("height", height)
				.on("mouseover", () => { focus.style("display", null) })
				.on("mouseout", () => { focus.style("display", "none") })
				.on("mousemove", mousemove)

		function mousemove() {
				let x0 = x.invert(d3.mouse(this)[0])
				let i = bisectDate(data, x0, 1)
				let d0 = data[i - 1]
				let d1 = data[i]
				let d = x0 - d0[x_data] > d1[x_data] - x0 ? d1 : d0
				focus.attr("transform", "translate(" + x(d[x_data]) + "," + y(d[y_data]) + ")")
				focus.select("text.txt1").text(d3.format(",.2r")(d[y_data]))
				focus.select("text.txt2").text(formatDate(d[x_data]))
				focus.select(".x-hover-line").attr("y2", height - y(d[y_data]))
				focus.select(".y-hover-line").attr("x2", -x(d[x_data]))
		}

})

// Parse Integers
// **************
function parse(data) {
  data.forEach(item => {
    Object.keys(item).forEach(curr => {
      if (!isNaN(item[curr])) item[curr] = parseInt(item[curr])
			if (curr === "year") item[curr] = parseDate(item[curr])
    })
  })
  return data
}

// NOTES:
// https://github.com/d3/d3-scale-chromatic
