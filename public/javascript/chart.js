Highcharts.setOptions({
    global: {
        useUTC: false
    }
});


var ratesInitial = {
};

var historyChart = function(div) {
    this.historyBack = 10000;
    this.divChart    = div;
    this.chart       = null;
    this.cronId      = null;
    this.last1       = null;
    
    
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
            count: 180,
            type: 'minute',
            text: '3H'
        }, {
            count: 1,
            type: 'day',
            text: '24H'
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
        plotLines: [{
            value: 0,
            width: 3,
            color: 'red',
        }]
    };
};

historyChart.prototype.load = function() {
    var self = this;
    this.loadDataHistory(function(last) {
        self.chart = new Highcharts.StockChart({
            series: self.prepareHistoryData(last),
            xAxis: self.xAxis,
            yAxis: self.yAxis,
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

historyChart.prototype.prepareHistoryData = function(data) {
    var series = [], s, rate;
    var setInitial = Object.keys(ratesInitial).length ? false : true;
    // set initial Values and convert last-values to percentage
    for (rate in data) {
        if (setInitial) ratesInitial[rate] = data[rate][data[rate].length-1][1];
        for (s in data[rate]) {
            data[rate][s] = [
                data[rate][s][0],
                parseFloat((data[rate][s][1]/ratesInitial[rate]*100-100).toFixed(1))
            ];
        }
    }
    // make highchart series-sets
    for (rate in data) {
        series.push({
            name : rate,
            data : data[rate],
            color: this.getRateColor(rate)
        });
    }
    return series;
};

historyChart.prototype.cron = function(interval, chart) {
    var self = this;
    this.cronId = setInterval(function() {
        $.getJSON('/ticker/last/1', function(last1) {
            self.last1 = last1;
            var rate, s;
            for (rate in last1) {
                for (s=0; s<chart.series.length;s++) {
                    if (chart.series[s].name === rate) {
                        chart.series[s].addPoint(
                            [
                                last1[rate][0][0],
                                parseFloat((last1[rate][0][1]/ratesInitial[rate]*100-100).toFixed(1))
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


historyChart.prototype.loadDataHistory = function(callback) {
    $.getJSON('/ticker/last/'+this.historyBack, function(last) {
        callback(last);
    });
};

historyChart.prototype.cronStop = function() {
    window.clearInterval(this.cronId);
};

historyChart.prototype.cronSetNew = function(interval) {
    this.cronStop();
    this.cron(interval, this.chart);
};

historyChart.prototype.destroy = function() {
    window.clearInterval(this.cronId);
    this.chart.destroy();
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