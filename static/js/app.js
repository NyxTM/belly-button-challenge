
const url="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Call data into the console. 
function init() {
  //Use the D3 library to read in samples.json
  d3.json(url).then(data => {
    console.log(data);

    // Use array to hold all ids
    let ids = data.samples.map(x => x.id)
    // Append id names into DropDown option
    ids.forEach(function(id) {
        d3.select('#selDataset')
          .append('option')
          .text(id)
    });
    // Reset  to first subject when page is refreshed.
    const first_sample = ids[0];
    plot(first_sample);
    demo(first_sample);
  });
};


// Display the default plot
function plot(sample_id) {
  d3.json(url).then(data => {
      let sample = data.samples.filter(x => x.id === sample_id)[0];
      console.log(sample);
      // Create arrays for sample_values, otu_ids, and otu_labels        
      let sample_values = sample.sample_values;
      let otu_ids = sample.otu_ids;
      let otu_labels = sample.otu_labels;


      // Create Bar Chart
      let trace1 = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10)
                  .map(x => `OTU ${x}`)
                  .reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type : 'bar',
        orientation : 'h',
        
      };

      // Create the layout
      var layout1 = {
        margin: {
            l: 150,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        }
      };

      let data1 = [trace1];
      Plotly.newPlot('bar', data1, layout1);


      // Create a bubble chart 
      let trace2 = {
      x : otu_ids,
      y : sample_values,
      text : otu_labels, 
      mode : 'markers',
        marker : {
            color : otu_ids,
            size : sample_values,
            colorscale: "Earth"
        }   
      };

      // Create the layout
      var layout2 = {
        margin: {
            l: 150,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        }
      };

      let data2 = [trace2];
      Plotly.newPlot('bubble', data2, layout2);

  });
};


//Display metadata
function demo(sample_id) {
  d3.json(url).then(data => {
    
    // Get metadata information
    let metadata = data.metadata;
    let value = metadata.filter(result => result.id == sample_id);
    let value_data = value[0];

    // Use Object.entries to add each key/value pair to the panel
    d3.select("#sample-metadata").html("");
    Object.entries(value_data).forEach(([key,value]) => {
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });


    //Create Gauge Chart
    let trace3 = [
      {
        domain: { x: [0, 5], y: [0, 1] },
        value: value_data.wfreq,
        type: "indicator",
        mode: "gauge",
        delta: { reference: 10 },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1},
          steps: [
            { range: [0, 1], color: "rgb(248, 243, 236)" },
            { range: [1, 2], color: "rgb(239, 234, 220)" },
            { range: [2, 3], color: "rgb(230, 225, 205)" },
            { range: [3, 4], color: "rgb(218, 217, 190)" },
            { range: [4, 5], color: "rgb(204, 209, 176)" },
            { range: [5, 6], color: "rgb(189, 202, 164)" },
            { range: [6, 7], color: "rgb(172, 195, 153)" },
            { range: [7, 8], color: "rgb(153, 188, 144)" },
            { range: [8, 9], color: "rgb(132, 181, 137)" },
          ],
        },
      },
    ]  

    let layout3 = {
      title: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week</br>",
      width: 350,
      height: 350,
      margin: { t: 50, r: 25, l: 25, b: 25 },
    };

    Plotly.newPlot("gauge", trace3, layout3);

  });
};



// pull new data for different visualization
function optionChanged(new_sample) {
  plot(new_sample);
  demo(new_sample);
};

init();