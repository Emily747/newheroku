function buildMetadata(sample) 
{
  console.log("Build metadata"); 

  // @TODO: Complete the following function that builds the metadata panel


  var selection = d3.select("#selDataset");
  var sampleNum = selection.property("value");

  console.log(sampleNum);

  var url = `/metadata/${sampleNum}`;

  // Use `d3.json` to fetch the metadata for a sample
  
  d3.json(url).then(function(data)
  {
    console.log(data)

    // Use d3 to select the panel with id of `#sample-metadata`

    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel

    //var list = panel.append("ul");

    Object.entries(data).forEach(function([key, value])
    {
      console.log(key, value);

      //var listItem = list.append("li");

      var row = panel.append("div")

      row.text(`${key}: ${value}`)
    });
  });
}

function buildCharts(sample) 
{
  console.log("Build new chart");

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  var selection = d3.select("#selDataset");
  var sampleNum = selection.property("value");
  var url = `/samples/${sampleNum}`
  
  d3.json(url).then(function(response)
  {
    console.log(response);
    var sample_values = response.sample_values.slice(0,10);
    var otu_labels = response.otu_labels.slice(0,10);
    var otu_ids = response.otu_ids.slice(0,10);

    // @TODO: Build a Bubble Chart using the sample data

    var trace = 
    {
      mode: "markers",
      text: otu_labels,
      x: otu_ids,
      y: sample_values,
      marker: 
      {
        size: sample_values,
        color: otu_ids
      }
    };

    var data = [trace];

    var layout = 
    {
      xaxis: 
      {
        type: "linear"
      },
      yaxis: 
      {
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot("bubble", data, layout);
    // @TODO: Build a Pie Chart

    var trace2 = 
    {
      type: "pie",
      labels: otu_ids,
      values: sample_values,
      hovertext: otu_labels
    };

    var data2 = [trace2];

    Plotly.newPlot("pie", data2);

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

function init() 
{
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => 
  {
    sampleNames.forEach((sample) => 
    {
      selector
      .append("option")
      .text(sample)
      .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) 
{
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();