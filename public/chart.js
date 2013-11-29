/**
 * Loads google Chart-API
 */
google.load("visualization", "1", {
    packages: ["corechart"]
});


/**
 * Draws Main-Linechart
 */
var drawChart = function(data) {
    var color = {
        silver: '#7A7A7A',
        blue: '#2155FF',
        gold: '#FFCC00',
        green: '#51CF87'
    };
    var options = {
        //title: 'Virtual Currency performance history',
        colors: [
            increaseBrightness(color.blue,50),
            color.blue,
            increaseBrightness(color.silver,50),
            color.silver,
            increaseBrightness(color.gold,50),
            color.gold,
            increaseBrightness(color.green,50),
            color.green
        ]
    };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
};