var svgWidth = 960;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 85,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var buffer = 2

var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";

function xScale(demoData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d[chosenXAxis] - buffer),
        d3.max(demoData, d => d[chosenXAxis] + buffer)
        ])
        .range([0, width]);

    return xLinearScale;
}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

var chosenYAxis = "healthcare";

function yScale(demoData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d[chosenYAxis] - buffer),
        d3.max(demoData, d => d[chosenYAxis] + buffer)
        ])
        .range([height, 0]);

    return yLinearScale;
}
function renderAxes(newYScale, yAxis) {
    var sideAxis = d3.axisBottom(newYScale);

    xAxis.transition()
        .duration(1000)
        .call(sideAxis);

    return yAxis;
}


function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "poverty") {
        label = "Poverty %:";
    }
    else {
        label = "Age";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Import Data
d3.csv("assets/data/data.csv").then(function (demoData, err) {
    if (err) throw err;

    demoData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    var xLinearScale = xScale(demoData, chosenXAxis);

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d.poverty - buffer), d3.max(demoData, d => d.poverty + buffer)])
        .range([0, width]);

    var yLinearScale = yScale(demoData, chosenYAxis);

    // var yLinearScale = d3.scaleLinear()
    //     .domain([d3.min(demoData, d => d.healthcare - buffer), d3.max(demoData, d => d.healthcare + buffer)])
    //     .range([height, 0]);
    // var bottomAxis = d3.axisBottom(xLinearScale);
    // var leftAxis = d3.axisLeft(yLinearScale);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var textGroup = chartGroup.selectAll(".abbr")
        .data(demoData)
        .enter()
        .append("text")
        .classed("abbr", true)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(d => d.abbr)
        .attr("dominate-baseline", "middle")
        .attr("text-anchor", "middle");


    var circlesGroup = chartGroup.selectAll("circle")
        .data(demoData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 30)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    var ylabelsGroup = chartGroup.append("g")
        .attr(rotate(90), "transform", `translate(${width / 2}, ${height + 20})`);

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("x", -60)
        .attr("y", -210)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

    var smokeLabel = ylabelsGroup.append("text")
        .attr("x", -60)
        .attr("y", -180)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");

    var obeseLabel = ylabelsGroup.append("text")
        .attr("x", -60)
        .attr("y", -140)
        .attr("value", "obese")
        .classed("inactive", true)
        .text("Obesity (%)");

    var toolTip1 = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty} % #2 <br>Lack Heathcare: ${d.healthcare} % `);
        });

    chartGroup.call(toolTip1);

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(demoData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLengthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLengthLabel
                        .classed("active", true)
                        .classed("inactive", false);


                }
            }
        });

        ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(demoData, chosenYAxis);

                // updates x axis with transition
                yAxis = renderAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLengthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLengthLabel
                        .classed("active", true)
                        .classed("inactive", false);


                }
            }
        });

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    // circlesGroup.on("click", function (data) {
    //     toolTip.show(data, this);
    // })
    //     // onmouseout event
    //     .on("mouseout", function (data, index) {
    //         toolTip.hide(data);
    //     });
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    // chartGroup.append("text")
    //     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    //     .attr("class", "axisText")
    //     .text("In Poverty %");

}).catch(function (error) {
    console.log(error);
});