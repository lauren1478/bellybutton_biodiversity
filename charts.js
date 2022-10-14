function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var sampleResult = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleResult).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterArray = sampleData.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = filterArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu = sampleResult.otu_ids;
    var otulabels = sampleResult.otu_labels;
    var samplevalues = sampleResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 


    var yticks = otu.slice(0,10).map(otu => `OTU ${otu}`).reverse();
    
    var otudata = samplevalues.slice(0,10).reverse();

    var hoverlabels = otulabels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: otudata,
      y: yticks,
      type: "bar",
      text: hoverlabels

    };
  
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Found in Bellybuttons",
      
    };
    
   
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  });



 /// Bubbles

 // Bar and Bubble charts
 // Create the buildCharts function.

  
      // 1. Create the trace for the bubble chart.
    var bubbleData = {
        x: otudata,
        y: yticks,
        text: hoverlabels,
        mode: "markers",
        marker: {
            size: samplevalues,
            color: otu,
            colorscale: 'Picnic',
    }};
  
      // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        automargin: true,
        hovermode: "closest"
    };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
 //Gauge Chart

  
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var samplesarray = metadata.filter(sampleObj => sampleObj.id == sample);
   
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = samplesarray[0];
    
    // 3. Create a variable that holds the washing frequency.
    var washFreq = metadata.wfreq;
      
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
        {
         value: washFreq,
         title: {text: "Belly Button Washing Frequency"},
         mode: "gauge+number",
         type: "indicator",
         gauge: {
           axis: { range: [0, 10] },
           bar: {color: "black"},
           steps: [
             {range:[0, 2], color: "purple"},
             {range:[2, 4], color: "blue"},
             {range:[4, 6], color: "green"},
             {range:[6, 8], color: "orange"},
             {range:[8, 10], color: "yellow"}
           ]
         }
        }
       ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 450, t: 0, b: 0};
    

    // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
 

 
};