$(function() {

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    
    var historyChart = function(div) {
        this.historyBack = 10000;
        this.divChart    = div;
        this.initial     = {};
        this.chart       = null;
        this.cronId      = null;
        
        
        this.rangeSelector = {
            buttons: [{
                count: 10,
                type: 'minute',
                text: '10M'
            }, {
                count: 60,
                type: 'minute',
                text: '1H'
            }, {
                count: 1,
                type: 'day',
                text: '1D'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 0,
            inputPosition: {
                align: 'right'
            },
        };
        this.title = {
            text: 'History'
        };
        this.xAxis = {
            type: 'datetime'
        };
        this.yAxis = {

        };
    };
    
    historyChart.prototype.load = function() {
        var self = this;
        this.loadDataHistory(function(last) {
            self.chart = new Highcharts.StockChart({
                series: self.prepareHistoryData(last),
                xAxis: self.xAxis,
                //yAxis: self.yAxis,
                rangeSelector: self.rangeSelector,
                title: self.title,
                chart : {
                    renderTo: self.divChart,
                    animation: false,
                    events: {
                        load: function() {
                            this.xAxis[0].addPlotLine({
                                value: (new Date()).getTime(),
                                color: 'red',
                                width: 2,
                                id: 'plot-line-1'
                            });
                            self.cron(2000, this);
                        }
                    }
                },
            });
                
        });
    };
    
    historyChart.prototype.cron = function(interval, chart) {
        var self    = this;
        this.cronId = setInterval(function() {
            $.getJSON('/ticker/last/1', function(last1) {
                var rate, s;
                for (rate in last1) {
                    for (s=0; s<chart.series.length;s++) {
                        if (chart.series[s].name === rate) {
                            chart.series[s].addPoint(
                                [
                                    last1[rate][0][0],
                                    Math.round((last1[rate][0][1]/self.initial[rate]*100-100)*10)/10
                                ],
                                false,
                                false
                            );
                            break;
                        }
                    }
                }
                chart.redraw();
            });
        }, interval);
    };

    historyChart.prototype.prepareHistoryData = function(data) {
        var series = [], s, rate;
        // set initial Values and convert last-values to percentage
        for (rate in data) {
            this.initial[rate] = data[rate][data[rate].length-1][1];
            for (s in data[rate]) {
                data[rate][s] = [
                    data[rate][s][0],
                    Math.round((data[rate][s][1]/this.initial[rate]*100-100)*10)/10
                ];
            }
        }
        // make highchart eries-sets
        for (rate in data) {
            series.push({
                name : rate,
                data : data[rate],
                color: this.getRateColor(rate)
            });
        }
        return series;
    };
    
    historyChart.prototype.loadDataHistory = function(callback) {
        $.getJSON('/ticker/last/'+this.historyBack, function(last) {
            callback(last);
        });
    };
    

    historyChart.prototype.getRateColor = function(rate) {
        var color = {
            ltc_btc: '#7A7A7A',     // gray
            btc_usd: '#FFCC00',     // gold
            ppc_btc: '#51CF87',     // green
            ftc_btc: '#BF199B',     // purple
            trc_btc: '#A6792B',     // brown
            blue: '#2155FF',        // blue
        };
        return (color[rate] === undefined) ? null: color[rate];
    };
    

    
    var history1 = new historyChart('divChartHistory');
    history1.load();
});