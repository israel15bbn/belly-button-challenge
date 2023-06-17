d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  console.log(data);

  var dropdown = d3.select("#selDataset");

  data.names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
  });

  var defaultId = data.names[0];

  updateDemographicInfo(defaultId, data);
  updateBarChart(defaultId, data);
  updateBubbleChart(defaultId, data);

  function optionChanged(id) {
    updateDemographicInfo(id, data);
    updateBarChart(id, data);
    updateBubbleChart(id, data);
  }

  dropdown.on("change", function() {
    var newId = d3.select(this).property("value");
    optionChanged(newId);
  });
});

function updateDemographicInfo(id, data) {
  var metadata = data.metadata.find(function(m) {
    return m.id.toString() === id.toString();
  });


  var sampleMetadata = d3.select("#sample-metadata");

  sampleMetadata.html("");

  Object.entries(metadata).forEach(function([key, value]) {
    sampleMetadata.append("p").text(`${key}: ${value}`);
  });
}

function updateBubbleChart(id, data) {
  var sample = data.samples.find(function(s) {
    return s.id === id;
  });


  var trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels,
    mode: "markers",
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids,
      colorscale: "Earth"
    }
  };

  var data = [trace];

  var layout = {
    title: "OTU Bubble Chart for Test Subject " + id,
    xaxis: { title: "OTU ID" },
  };


  Plotly.newPlot("bubble", data, layout);
}


function updateBarChart(id, data) {
  var sample = data.samples.find(function(s) {
    return s.id === id;
  });


  var sortedOtuIds = sample.otu_ids.slice().sort((a, b) => sample.sample_values[b] - sample.sample_values[a]);
  var sortedSampleValues = sample.sample_values.slice().sort((a, b) => b - a);
  var sortedOtuLabels = sortedOtuIds.map(function(id) {
    return sample.otu_labels[sample.otu_ids.indexOf(id)];
  });


  var topOtuIds = sortedOtuIds.slice(0, 10).reverse();
  var topSampleValues = sortedSampleValues.slice(0, 10).reverse();
  var topOtuLabels = sortedOtuLabels.slice(0, 10).reverse();


    var trace = {
        x: topSampleValues,
        y: topOtuIds.map(function(id) {
          return `OTU ${id}`;
        }),
        text: topOtuLabels,
        type: "bar",
        orientation: "h"
      };
    
    
      var data = [trace];
    
      
      var layout = {
        title: "OTU Bar Chart for Test Subject " + id,
      };
    
    
      Plotly.newPlot("bar", data, layout);
    };

