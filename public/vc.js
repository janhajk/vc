var step = 5; // in secondes
var initial;

(function() {
    $(document).ready(function() {
        
        var verlauf= new google.visualization.DataTable({
            cols: [{id: 'time', label: 'Time', type: 'datetime'},
                   {id: 'ltc_btc'   , label: 'LTC-BTC'   , type: 'number'},
                   {id: 'ltc_btc_gm', label: 'LTC-BTC GM', type: 'number'},
                   {id: 'ltc_usd'   , label: 'LTC-USD'   , type: 'number'},
                   {id: 'ltc_usd_gm', label: 'LTC-USD GM', type: 'number'},
                   {id: 'btc_usd'   , label: 'BTC-USD'   , type: 'number'},
                   {id: 'btc_usd_gm', label: 'BTC-USD GM', type: 'number'}]});
        
        
        var update = function() {
            $.getJSON('/ticker/update', function(last){
                var c = verlauf.getNumberOfRows();
                if (c === 0) initial = last;
                var changeBTC_USD = getChange(c ? initial.btc_usd : last.btc_usd, last.btc_usd);
                var changeLTC_USD = getChange(c ? initial.ltc_usd : last.ltc_usd, last.ltc_usd);
                var changeLTC_BTC = getChange(c ? initial.ltc_btc : last.ltc_btc, last.ltc_btc);
                verlauf.addRow([
                    new Date(),
                    changeLTC_BTC,
                    (c ? geometricMean(verlauf, 1, 20) : changeLTC_BTC),
                    changeLTC_USD,
                    (c ? geometricMean(verlauf, 3, 20) : changeLTC_USD),
                    changeBTC_USD,
                    (c ? geometricMean(verlauf, 5, 20) : changeBTC_USD),
                ]);
                document.title = 'LTC-BTC: ' + last.ltc_btc + ', ' + changeLTC_BTC.toFixed(1) + '%';
                $('#content li:first a').html(last.ltc_btc)
                drawChart(verlauf);
            });
        };
        update();
        setTimeout(update, 4000);
        setInterval(update, step*1000);
    });
})();


var getChange = function(startVal, curVal) {
    return (curVal / startVal - 1) * 100;
};


/**
 * Geometric Mean of last nth elements of an array
 * 
 * @param {Array} data An Array containing data
 * @param {Number} index index of array to get geometric mean from
 * @param {Number} last The nth last Elements from the array
 */
var geometricMean = function(data, index, last) {
    var i;
    var len = data.getNumberOfRows();
    if (last > len) last = len;
    var gMittel = data.getValue(0, index)+1000;
    for (i = len-last+1; i < len; i++) {
        gMittel = gMittel * (data.getValue(i, index)+1000);
    }
    return Math.pow(gMittel, 1/last)-1000;
};

google.load("visualization", "1", {
    packages: ["corechart"]
});


var drawChart = function(data) {
    var options = {
        title: 'Ltc performance history',
        colors: [increaseBrightness('#7A7A7A',50),'#7A7A7A', increaseBrightness('#2155FF',50),'#2155FF',increaseBrightness('#FFCC00',50),'#FFCC00']
    };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
};





var increaseBrightness = function(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
};



