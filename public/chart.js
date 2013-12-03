/**
 * Loads google Chart-API
 */
google.load("visualization", "1", {
    packages: ["corechart"]
});




/**
 * Draws Market-Depth Chart
 */
var drawChartMarketDepth = function(data) {
    var color = {
        silver: '#7A7A7A',
        blue: '#2155FF',
        gold: '#FFCC00',
        green: '#51CF87',
        purple: '#BF199B'
    };
    var options = {
        //title: 'Virtual Currency performance history',
        colors: [
            increaseBrightness(color.gold,50),
            color.gold,
            increaseBrightness(color.silver,50),
            color.silver,
            increaseBrightness(color.green,50),
            color.green,
            increaseBrightness(color.purple,50),
            color.purple,
            increaseBrightness(color.blue,50),
            color.blue
        ]
    };
    var chart = new google.visualization.LineChart(document.getElementById('divChartDepth'));
    chart.draw(data, options);
};


/**
 * Draws History-Linechart
 */
var drawChartHistory = function(data) {
    var color = {
        silver: '#7A7A7A',
        blue: '#2155FF',
        gold: '#FFCC00',
        green: '#51CF87',
        purple: '#BF199B'
    };
    var options = {
        //title: 'Virtual Currency performance history',
        colors: [
            increaseBrightness(color.gold,50),
            color.gold,
            increaseBrightness(color.silver,50),
            color.silver,
            increaseBrightness(color.green,50),
            color.green,
            increaseBrightness(color.purple,50),
            color.purple,
            increaseBrightness(color.blue,50),
            color.blue
        ]
    };
    var chart = new google.visualization.LineChart(document.getElementById('divChartHistory'));
    chart.draw(data, options);
};