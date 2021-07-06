// SELECT
let firstSquare = d3.select("rect")
let middleSquare = d3.select("#center")

// SELECT ALL
let allSquares = d3.selectAll("rect")
let middleSquares = d3.selectAll(".side")

// APPEND
let canvas = d3.select("#canvas")
let rect = canvas.append("rect")
rect.attr("x", 190)
rect.attr("y", 10)
rect.attr("width", 50)
rect.attr("height", 50)
rect.attr("fill", "green")

// METHOD CHAINING
rect = d3.select("#canvas")
       .append("rect")
       .attr("x", 250)
       .attr("y", 10)
       .attr("width", 50)
       .attr("height", 50)
       .attr("fill", "blue")

// EXERCISE

// 1.
let svg = d3.select("#chart-area").append("svg")
            .attr("width", 400)
            .attr("height", 400)

// 2.
let circle = svg.append("circle")
          	.attr("cx", 100)
          	.attr("cy", 250)
          	.attr("r", 70)
          	.attr("fill", "#1610B8")

// 3.
rect = svg.append("rect")
    	 .attr("x", 20)
    	 .attr("y", 20)
    	 .attr("width", 20)
    	 .attr("height", 20)
    	 .attr("fill","#CE0428")
