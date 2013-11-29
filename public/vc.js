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









