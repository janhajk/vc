var step = 5; // in secondes
(function() {
    $(document).ready(function() {
        
        var verlauf = [['Time', 'LTC-BTC', 'LTC-BTC GM', 'BTC-USD', 'BTC-USD GM', 'LTC-USD', 'LTC-USD GM'/*, 'LTC-(USD-BTC)'*/]];
        
        var ltc = {
            amount : 53,
            paid   : 0.9636
        };
        var initial;
        
        var update = function() {
            $.getJSON('/ltc', function(last){
                var date = new Date;
                if (verlauf.length === 1) initial = last;
                var wertNow = ltc.amount * last.ltc_btc;
                var change = wertNow/ltc.paid - 1;
                var change$ = change*ltc.paid*last.btc_usd;
                change$ = change$.toFixed(1);
                change = Math.round(change*1000)/1000*100;
                var changeBTC_USD = getChange(verlauf.length > 1 ? initial.btc_usd : last.btc_usd, last.btc_usd);
                var changeLTC_USD = getChange(verlauf.length > 1 ? initial.ltc_usd : last.ltc_usd, last.ltc_usd);
                var changeLTC_BTC = getChange(verlauf.length > 1 ? initial.ltc_btc : last.ltc_btc, last.ltc_btc);
                verlauf.push(
                    [date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                    changeLTC_BTC,
                    (verlauf.length > 1 ? geometricMean(verlauf, 1, 20) : changeLTC_BTC),
                    changeBTC_USD,
                    (verlauf.length > 1 ? geometricMean(verlauf, 3, 20) : changeBTC_USD),
                    changeLTC_USD,
                    (verlauf.length > 1 ? geometricMean(verlauf, 5, 20) : changeLTC_USD),
                ]);
                change = change.toFixed(1);
                document.title = last.ltc_btc + ', ' + changeLTC_BTC + '%';
                drawChart(google.visualization.arrayToDataTable(verlauf));
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
    var len = data.length-1;
    if (last > len) last = len;
    var gMittel = data[len+1-last][index]+1000;
    for (i = len+2-last; i < data.length; i++) {
        gMittel = gMittel * (data[i][index]+1000);
    }
    return Math.pow(gMittel, 1/last)-1000;
};

google.load("visualization", "1", {
    packages: ["corechart"]
});


var drawChart = function(data) {
    var options = {
        title: 'Ltc performance history'
    };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
};



