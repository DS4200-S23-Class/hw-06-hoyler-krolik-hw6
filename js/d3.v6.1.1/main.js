// Create the Frame dimensions
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Add Left Scatter frame as svg
const LEFT_SCATTER_FRAME = d3.select('.left-scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "middle");

// Add Left Scatter frame as svg
const MID_SCATTER_FRAME = d3.select('.mid-scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "middle");

// creat scatter dimensions
const LEFT_SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const LEFT_SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;
const MID_SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const MID_SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Reading from file and appending points
d3.csv("data/iris.csv").then((data) => {

    // Getting max X and Y coords
    const MAX_X = d3.max(data, (d) => 
                                {return parseInt(d.Sepal_Length) + 1});
    
    const MAX_Y = d3.max(data, (d) => 
                                {return parseInt(d.Petal_Length) + 1});
    // X coord scale function
    const X_SCALE = d3.scaleLinear()
                            .domain([0, MAX_X])
                            .range([0, LEFT_SCATTER_WIDTH]);
    
    // Y coord scale function
    const Y_SCALE = d3.scaleLinear()
                        .domain([0, (MAX_Y)])
                        .range([LEFT_SCATTER_HEIGHT, 0]);


    // plot the scatter points
    LEFT_SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(d.Sepal_Length) + MARGINS.left)})
                .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE(d.Petal_Length)))})
                .attr("r", 5)
                .attr("class", (d) => {return d.Species});


    // plot the bottom and side axis

    LEFT_SCATTER_FRAME.append("g")
                    .attr("transform", "translate(" + MARGINS.top + "," + 
                    (LEFT_SCATTER_HEIGHT + MARGINS.top) + ")")
                    .call(d3.axisBottom(X_SCALE).ticks(10))
                        .attr("font-size", "12px");


    LEFT_SCATTER_FRAME.append("g")
                    .attr("transform", "translate(" + 
                    (MARGINS.left) + "," + (MARGINS.top) + ")")
                    .call(d3.axisLeft(Y_SCALE).ticks(10))
                        .attr("font-size", "12px");

});

// Reading from file and appending points
d3.csv("data/iris.csv").then((data) => {

    // Getting max X and Y coords
    const MAX_X = d3.max(data, (d) => 
                                {return parseInt(d.Sepal_Width) + 1});
    
    const MAX_Y = d3.max(data, (d) => 
                                {return parseInt(d.Petal_Width) + 1});
    // X coord scale function
    const X_SCALE = d3.scaleLinear()
                            .domain([0, (MAX_X)])
                            .range([0, MID_SCATTER_WIDTH]);
    
    // Y coord scale function
    const Y_SCALE = d3.scaleLinear()
                        .domain([0, (MAX_Y)])
                        .range([MID_SCATTER_HEIGHT, 0]);


    // plot the scatter points
    MID_SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(d.Sepal_Width) + MARGINS.left)})
                .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE(d.Petal_Width)))})
                .attr("r", 5)
                .attr("class", (d) => {return d.Species});


    // plot the bottom and side axis

    MID_SCATTER_FRAME.append("g")
                    .attr("transform", "translate(" + MARGINS.top + "," + 
                    (MID_SCATTER_HEIGHT + MARGINS.top) + ")")
                    .call(d3.axisBottom(X_SCALE).ticks(8))
                        .attr("font-size", "12px");


    MID_SCATTER_FRAME.append("g")
                    .attr("transform", "translate(" + 
                    (MARGINS.left) + "," + (MARGINS.top) + ")")
                    .call(d3.axisLeft(Y_SCALE).ticks(10))
                        .attr("font-size", "12px");

    
    // function to add styling on brushing
    function updateChart() {
        console.log("This works")
    };
        
    // Add brushing
    MID_SCATTER_FRAME
        .call(d3.brush()                 // Add the brush feature using the d3.brush function
            .extent([[0,0], [FRAME_WIDTH,FRAME_HEIGHT]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("start brush", updateChart)); // Each time the brush selection changes, trigger the 'updateChart' function
  
});


// create frame for bar chart
const BAR = d3.select('.columns')
    .append("div")
    .html("<h3>Counts of Species</h3>")
    .style("text-align", "center")
    .attr("class", "bar-chart")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH);


// with scale function
const BAR_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const BAR_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const bar_data = [{"Species": "virginica", 'Count': 50},
                    {"Species": "versicolor", 'Count': 50},
                    {"Species": "setosa", 'Count': 50}]

// Scaling functions
const xScaleBar = d3.scaleBand().range([0, BAR_WIDTH]).padding(0.2);
const yScaleBar = d3.scaleLinear().range([BAR_HEIGHT, 0]);

xScaleBar.domain(bar_data.map((d) => {
    return d.Species
}));
yScaleBar.domain([0, d3.max(bar_data, (d) => {
    return d.Count
}) + 10])

BAR.selectAll("bars")
    .data(bar_data)
    .enter()
    .append("rect")
    .attr("class", (d) => {
        return d.Species
    })
    .attr("x", (d) => {
        return (xScaleBar(d.Species) + MARGINS.left)
    })
    .attr("y", (d) => {
        return ( MARGINS.left + yScaleBar(d.Count))
    })
    .attr("width", xScaleBar.bandwidth())
    .attr("height", (d) => {
        return BAR_HEIGHT - yScaleBar(d.Count)
    });

BAR.append("g")
    .attr("transform", "translate(" + MARGINS.top + "," +
        (BAR_HEIGHT + MARGINS.top) + ")")
    .call(d3.axisBottom(xScaleBar).ticks(11))
    .attr("font-size", "15px");

BAR.append("g")
    .attr("transform", "translate(" +
        (MARGINS.left) + "," + (MARGINS.top) + ")")
    .call(d3.axisLeft(yScaleBar).ticks(11))
    .attr("font-size", "15px");

