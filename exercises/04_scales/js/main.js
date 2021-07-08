// SCALES
// ******

function print(text) {
  console.log(text)
}

// LINEAR SCALE
// d3.scaleLinear().domain([a, b]).range([r, s])
let y = d3.scaleLinear().domain([0, 828]).range([0, 400]);
print(y(100))
print(y.invert(48.3))

// LOGARITHMIC SCALE
// d3.scaleLog().domain([a, b]).range([r, s]).base(n)
let x = d3.scaleLog().domain([300, 150000]).range([0, 400]).base(10)
print(x(500))
print(x.invert(32.9))

// TIME SCALE
// d3.scaleTime().domain([a, b]).range([r, s])
let t = d3.scaleTime().domain([new Date(2010,0,1), new Date(2011,0,1)]).range([0, 400])
print(t(new Date(2010, 2, 11)))
print(t.invert(75.62))

// ORDINAL SCALE
// d3.scaleOrdinal().domain([...]).range(r)
let color = d3.scaleOrdinal()
	.domain(["AZTECS", "MAYANS", "INCAS", "WIRRARIKA", "NAVAJO"])
	.range(["RED", "BLUE", "YELLOW", "ORANGE", "INDIGO"])
print(color("MAYANS"))

// BAND SCALES
// d3.scaleBand().domain([...]).range([r,s]).paddingInner(p1).paddingOuter(p2)
let b = d3.scaleBand()
        	.domain(["AZTECS", "MAYANS", "INCAS", "WIRRARIKA", "NAVAJO"])
        	.range([0, 400])
        	.paddingInner(0.3)
        	.paddingOuter(0.2)
print(b("WIRRARIKA"))
print(b.bandwidth())

// UTILS
// *****

let data = [
  { name: "Jake", height: 1.63 },
	{ name: "Aaron", height: 1.80 },
	{ name: "Mary", height: 1.72 }
]

// MAX
let maxH = d3.max(data, d => { return d.height })
let maxN = d3.max(data, d => { return d.name })
print(maxH)
print(maxN)

// MIN
let minH = d3.min(data, d => { return d.height })
let minN = d3.min(data, d => { return d.name })
print(minH)
print(minN)

// EXTENT
let rangeH = d3.extent(data, d => { return d.height })
let rangeN = d3.extent(data, d => { return d.name })
print(rangeH)
print(rangeN)

// MAP
let names = data.map(d => { return d.name })
print(names)

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

  const heights = data.map(d => { return d.height })
  const names = data.map(d => { return d.name })
  const max = d3.max(data, d => { return d.height })

  const svg = d3.select("#chart-area").append("svg").attr("width", 500).attr("height", 500)
  const rect = svg.selectAll("rect").data(data)

  // X-Axis => Band Scale
  const band = d3.scaleBand()
              	 .domain(names).range([0, 400])
                 .paddingInner(0.3).paddingOuter(0.3)

  // Y-Axis => Linear Scale
  const linear = d3.scaleLinear()
                   .domain([0,max]).range([0, 400])

  // Color Scheme => Ordinal Scale
  const ordinal = d3.scaleOrdinal()
   	                .domain(names).range(d3.schemeSet3)

  rect.enter()
      .append("rect")
      .attr("x", (d, i) => band(d.name) + 40)
      .attr("y", d => (linear(max) - linear(d.height)) + 50)
      .attr("width", d => band.bandwidth())
      .attr("height", d => linear(d.height))
      .attr("fill", (d, i) => ordinal(ordinal(i)))

}).catch(error => print(error))
