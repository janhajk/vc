(function() {
    $(document).ready(function() {
        
        var step = 5; // in secondes
        
        var mDepth= new google.visualization.DataTable({
            cols: [{id: 'time', label: 'Time', type: 'datetime'},
                   {id: 'ltc_btc'   , label: 'LTC-BTC'   , type: 'number'},
                   {id: 'ltc_btc_gm', label: 'LTC-BTC GM', type: 'number'},
                   {id: 'ltc_usd'   , label: 'LTC-USD'   , type: 'number'},
                   {id: 'ltc_usd_gm', label: 'LTC-USD GM', type: 'number'},
                   {id: 'btc_usd'   , label: 'BTC-USD'   , type: 'number'},
                   {id: 'btc_usd_gm', label: 'BTC-USD GM', type: 'number'},
                   {id: 'ppc_btc'   , label: 'PPC-BTC'   , type: 'number'},
                   {id: 'ppc_btc_gm', label: 'PPC-BTC GM', type: 'number'},
                   {id: 'ftc_btc'   , label: 'FTC-BTC'   , type: 'number'},
                   {id: 'ftc_btc_gm', label: 'FTC-BTC GM', type: 'number'}]});
        
        
        var update = function() {
            $.getJSON('/ticker/update', function(last){
                mDepth.addRow([
                    new Date(),
                ]);
                drawChartMarketDepth(mDepth);
                setTimeout(update, step*1000);
            });
        };

    });
})();








