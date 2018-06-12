function getOptions() {
    console.log("getOptions")
    // get reference to dropdown id
    var selector = document.getElementById('selDataset')

    // read in data from our names route to populate the dropdown menu
    Plotly.d3.json('/names', function(error, sampleNames) {
        if (error) return console.warn(error);

        for (var i=0; i< sampleNames.length; i++){
            var currentOption = document.createElement('option') // <option></option>

            currentOption.text = sampleNames[i]; // <option>BB_940</option>
            currentOption.value = sampleNames[i]; // <option value="BB_940">BB_940</option>

            selector.appendChild(currentOption)
        }

        // initialize the first chart
        getData(sampleNames[0], buildCharts);

    })
}

function getData(sample, callback) {
    console.log("getData")
    // read in the data and run the callback function
    Plotly.d3.json(`/samples/${sample}`, function(error, sampleData) {
        if (error) return console.warn(error);
        Plotly.d3.json('/otu', function(error, otuData) {
            if (error) return console.warn(error);

            callback(sampleData, otuData)
        })

    })

    //read in the metadata
    Plotly.d3.json(`/metadata/${sample}`, function(error, metaData) {
    	updateMetaData(metaData)
    })

}

function buildCharts(sampleData, otuData) {
    console.log("buildCharts")
    // build the bubble charts
console.log(sampleData)
    var trace1 = {
          x: sampleData[0]["otu_ids"],
          y: sampleData[0]["sample_values"],
          mode: 'markers',
          marker: {
            color: sampleData[0]["otu_ids"],
            size: sampleData[0]["sample_values"],
            colorscale: "Earth"
          }
        };
       // console.log(sampleData[0]["otu_ids"])
        
        var data = [trace1];

        var layout = {
                margin:{t: 0},
                xaxis: {title: "OTU ID"}
        };

        var BUBBLE = document.getElementById('bubble');

        Plotly.plot(BUBBLE, data, layout);


    // TODO: build the pie charts
    Plotly.d3.json("/samples/BB_940", function(error, response) {
             console.log("hello");
             console.log(response);
             console.error(error);
             var data=[{
                 values: response.sample_values.slice(0,10),
                labels: response.otu_ids.slice(0,10),
                 type:"pie" 
            }];
             var layout={
                 height:400,
                 width:500
             }
        
            var PIE=document.getElementById('pie');
             Plotly.plot(PIE, data,layout);
    }
};

function optionsChanged(newSample) {
    console.log("optionsChanged")
    // takes in new data from the dropdown and updates the current charts
    getData(newSample, updateCharts);
}

function updateCharts(sampleData, otuData) {
    console.log("updateCharts")
    var sampleValues = sampleData[0]["sample_values"];
    var otuIDs = sampleData[0]["otu_ids"];

    // update the bubble chart
    var BUBBLE = document.getElementById('bubble');

    Plotly.restyle(BUBBLE, 'x', [otuIDs]);
    Plotly.restyle(BUBBLE, 'y', [sampleValues]);

    // TODO: update the pie chart
}

function updateMetaData(metadata) {
    console.log("updateMetaData")
        // Reference to Panel element for sample metadata
        var PANEL = document.getElementById("sample-metadata");
        // Clear any existing metadata
        PANEL.innerHTML = '';
        // Loop through all of the keys in the json response and
        // create new metadata tags
        for(var key in data) {
            h6tag = document.createElement("h6");
            h6Text = document.createTextNode(`${key}: ${data[key]}`);
            h6tag.append(h6Text);
            PANEL.appendChild(h6tag);

        }
 }
function init() {
    getOptions();
}

init();

// Plotly.d3.json("/samples/BB_940", function(error, response) {
//     console.log(response);
//     console.error(error);
//     var data=[{
//         values: response.sample_values.slice(0,10),
//         labels: response.otu_ids.slice(0,10),
//         type:"pie" 
//     }];
//     var layout={
//         height:400,
//         width:500
//     }

//     Plotly.newPlot("pie",data,layout);
    
//     // Create a scatter plot
// var trace1 = {
//     x: response.otu_ids,
//     y: response.sample_values,
//     mode: "markers",
//     type: "scatter",
//     name: "high jump",
//     marker: {
//       size:response.sample_values,
//       color: "#2077b4",
//       symbol: "circle"
//     }
    
// };
// Plotly.newPlot("scatter",[trace1],layout)
   
// });

//Getting references
//  var selDataset = document.getElementById("selDataset");
//  var PANEL = document.getElementById("sample-metadata");
//  var PIE = document.getElementById("pie");
//  var BUBBLE = document.getElementById("bubble");
//  var Gauge = document.getElementById("gauge");
