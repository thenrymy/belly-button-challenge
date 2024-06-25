// Build the metadata panel
function buildMetadata(sample) {
  d3.json(
    "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
  ).then((data) => {
    // get the metadata field
    let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter((item) => item.id == sample);
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel
        .append("p")
        .text(`${key.toUpperCase()}: ${value}`)
        .style("font-size", "14px");
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(
    "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
  ).then((data) => {
    // Get the samples field
    let samples = data.samples;
    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter((item) => item.id == sample);
    let result = resultArray[0];
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Rainbow",
      },
    };

    let dataBubble = [trace1];

    let layoutBubble = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false, // Hide the legend.
      height: 600,
      width: 1200,
      xaxis: {
        title: "OTU ID", // Add X label.
      },
      yaxis: {
        title: "Number of Bacteria", // Add Y label.
      },
    };
    // Render the Bubble Chart
    Plotly.newPlot("bubble", dataBubble, layoutBubble);
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map((item) => `OTU ${item}`);
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      type: "bar",
      orientation: "h",
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.reverse(),
      text: otu_labels,
    };

    let dataBar = [trace2];

    let layoutBar = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria",
      },
    };
    // Render the Bar Chart
    Plotly.newPlot("bar", dataBar, layoutBar);
  });
}

// Function to run on page load
function init() {
  d3.json(
    "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
  ).then((data) => {
    // Get the names field
    let names = data.names;
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });
    // Get the first sample from the list
    let firstSample = names[0];
    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialise the dashboard
init();
