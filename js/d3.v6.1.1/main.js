// Create the Frame dimensions
let FRAME_HEIGHT = 500;
let FRAME_WIDTH = 500;
let MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Add Left Scatter frame as svg
let LEFT_SCATTER_FRAME = d3.select('.left-scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "left");

// Add Left Scatter frame as svg
let MID_SCATTER_FRAME = d3.select('.mid-scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("id", "middle");

// creat scatter dimensions
let LEFT_SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
let LEFT_SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;
let MID_SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
let MID_SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

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
    let leftPoints = LEFT_SCATTER_FRAME.selectAll("circle")
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


    // second frame 
    // Getting max X and Y coords
    const MAX_X2 = d3.max(data, (d) => 
                                {return parseInt(d.Sepal_Width) + 1});
    
    const MAX_Y2 = d3.max(data, (d) => 
                                {return parseInt(d.Petal_Width) + 1});
    // X coord scale function
    const X_SCALE2 = d3.scaleLinear()
                            .domain([0, (MAX_X2)])
                            .range([0, MID_SCATTER_WIDTH]);
    
    // Y coord scale function
    const Y_SCALE2 = d3.scaleLinear()
                        .domain([0, (MAX_Y2)])
                        .range([MID_SCATTER_HEIGHT, 0]);


    // plot the scatter points
    let myPoints = MID_SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE2(d.Sepal_Width) + MARGINS.left)})
                .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE2(d.Petal_Width)))})
                .attr("r", 5)
                .attr("class", (d) => {return d.Species})
                .attr("id", (d) => {return d.id});

    // plot the bottom and side axis
    MID_SCATTER_FRAME.append("g")
                    .attr("transform", "translate(" + MARGINS.top + "," + 
                    (MID_SCATTER_HEIGHT + MARGINS.top) + ")")
                    .call(d3.axisBottom(X_SCALE2).ticks(8))
                        .attr("font-size", "12px");


    MID_SCATTER_FRAME.append("g")
                    .attr("transform", "translate(" + 
                    (MARGINS.left) + "," + (MARGINS.top) + ")")
                    .call(d3.axisLeft(Y_SCALE2).ticks(10))
                        .attr("font-size", "12px");

        
    // Add brushing
    MID_SCATTER_FRAME
        .call(d3.brush()                 // Add the brush feature using the d3.brush function
            .extent([[MARGINS.left, MARGINS.top], [FRAME_WIDTH + MARGINS.left,FRAME_HEIGHT + MARGINS.top]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("start brush", updateChart)); // Each time the brush selection changes, trigger the 'updateChart' function

    // // Add brushing
    // LEFT_SCATTER_FRAME
    //     .call(d3.brush()                 // Add the brush feature using the d3.brush function
    //         .extent([[MARGINS.left, MARGINS.top], [FRAME_WIDTH + MARGINS.left,FRAME_HEIGHT + MARGINS.top]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //         .on("start brush", updateChart)); // Each time the brush selection changes, trigger the 'updateChart' function


    // A function that return TRUE or FALSE according if a dot is in the selection or not
    function isBrushed(brush_coords, cx, cy) {
    let x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
   return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
};


    // function to add styling on brushing
    function updateChart(event) {
        let extent = event.selection;

        myPoints.classed("selected", (d) => { 
            // // list of visited species , use set
            const speciesSet = new Set();
            if (d.Species == "virginica" || d.Species ==  "versicolor" || d.Species == "setosa"){
                speciesSet.add(d.Species);
            }

            return isBrushed(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top)
        });

        leftPoints.classed("selected", (d) => {return isBrushed(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top)});

        // each time you add a point or remove a point, iterate through all with loop and check which bars
        // instead use d3 selectAll myPoints (use ), from there use d3 classed function, conditionally \
        // if d .species is in set, then return slected 
        bars.classed("selected", (d) => {return speciesSet.has(d.Species)})

    };

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

let bars = BAR.selectAll("bars")
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

});




