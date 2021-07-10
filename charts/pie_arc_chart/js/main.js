// Config
const width = 800, height = 450, margin = 40
const radius = Math.min(width, height) / 2 - margin

const g = d3.select("#chart-area")
	.append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
		.attr("transform", "translate(" + (width / 3) + "," + height / 2 + ")")

// Scale, Arc Generator & Pie Layout
const color = d3.scaleOrdinal().range(d3.schemeDark2)
const arc = d3.arc().outerRadius(radius).innerRadius(0)
const pie = d3.pie().value(d => d.value).sort(null)

// Data
let data1, data2

// Update
function update(data) {

  // Domain
  color.domain(Object.keys(data))

  // Join
  const chart = g.selectAll("path").data(pie(d3.entries(data)))
  // Exit
  chart.exit().remove()
  // Enter & Update
  chart.enter()
    .append('path')
    .merge(chart)
    .transition().duration(1000)
    .attr('d', arc)
    .attr('fill', d => color(d.data.key))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

  // Legend
  addLegend("#000")

}

// Add Legend
function addLegend(textColor) {

  const rectSize = 30, spacing = 10

  let legend = g.selectAll('.legend').data(color.domain())

  legend.exit().remove()

  legend.enter()
    .append('g')
    .merge(legend)
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      const height = rectSize + spacing
      const offset =  height * color.domain().length / 2
      const horz = width / 2
      const vert = i * height - offset
      return 'translate(' + horz + ',' + vert + ')'
    })
    .append('rect')
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', color)
      .style('stroke', color)

    g.selectAll('.legend').append('text')
      .merge(legend)
      .attr('x', spacing - rectSize * 2.9)
      .attr('y', rectSize - spacing)
      .style('fill', textColor)
      .text(d => d)

}

// Data
d3.tsv("https://raw.githubusercontent.com/gcastillo56/d3Lab/master/charts/pie_arc_chart/data/donut2.tsv").then(data => {
    parse(data)

    const byFruit = d3.nest().key(d => d.fruit).entries(data)
    const fruits = byFruit.map(fruit => fruit.key)
    const byRegion = d3.nest().key(d => d.region).entries(data)
    const byRegionData = byRegion.map(curr => curr.values)

    // Fruits
    fruits.forEach(fruit => {
      let obj = {}
      byRegionData.map(region => {
        sum = 0
        region.forEach(curr => sum += (curr.fruit === fruit ? curr.count : 0))
        obj[region[0].region] = sum
      })
      if (fruit === "Apples") data1 = obj
      else data2 = obj
    })

    update(data1)
}).catch(error => console.log(error))

// Parse Data
function parse(data) {
  data.forEach(item => {
    Object.keys(item).forEach(curr => {
      if (!isNaN(item[curr])) item[curr] = parseFloat(item[curr])
    })
  })
  return data
}

// NOTES:
// https://github.com/d3/d3-scale-chromatic
