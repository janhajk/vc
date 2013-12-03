var History = function() {
    
    var self = this;
    
    this.urlUpdate = '/ticker/update';
    
    this.verlauf   = new google.visualization.DataTable();
    
    this.initial   = {};
    
    this.updateStep = 10; // in seconds
    
    this.rates = {
        btc_usd: {
            label: 'BTC-USD',
            color: 'gold',
            active: true,
            gm: false
        },
        ltc_btc: {
            label: 'LTC-BTC',
            color: 'silver',
            active: true,
            gm: true
        },
        ppc_btc: {
            label: 'PPC-BTC',
            color: 'green',
            title: true,
            active: true,
            gm: true
        },
        ftc_btc: {
            label: 'FTC-BTC',
            color: 'purple',
            active: true,
            gm: true
        }
    };
    
    // Add Columns
    this.verlauf.addColumn({id: 'time', label: 'Time', type: 'datetime'});
    for (var rate in this.rates) {
        this.verlauf.addColumn({
            type: 'number',
            label: this.rates[rate].label,
            id: rate
        });
        this.verlauf.addColumn({
            type: 'number',
            label: this.rates[rate].label + ' GM',
            id: rate + '_gm'
        });
    }
    
    this.start = function() {
        this.updateInterval = window.setInterval(function(){self.update();}, self.updateStep*1000);
    };
    

    window.onresize=function(){drawChartHistory(self.verlauf)};    
    
    /**
     * Check if update-function is still running; if not reactivate
     */
    setInterval(function(){
        if (!self.verlauf.getNumberOfRows()) return;
        var last = new Date(self.verlauf.getValue(self.verlauf.getNumberOfRows()-1, 0));
        if ((new Date() - last) > 1000*5*60) {
            self.update();
        }
    }, 1000*5*60);

};



History.prototype.update = function() {
    var self = this;
    $.getJSON(this.urlUpdate, function(last){
        var c = self.verlauf.getNumberOfRows();
        var row = [new Date()];
        if (c === 0) self.initial = last;
        for (var rate in self.rates) {
            row.push(self.getChange(c ? self.initial[rate].last : last[rate].last, last[rate].last));
            row.push((c ? geometricMean(self.verlauf, row.length-1, 20) : row[row.langth-1]));
        }
        self.verlauf.addRow(row);
        if (c > 500) self.verlauf.removeRow(0);
        drawChartHistory(self.verlauf);
        //setTimeout(self.update, self.updateStep*1000);
    });  
};


History.prototype.geometricMeanTable = function(table) {
    if (table.length === 1) return table[0];
    if (table.length === 0) return false;
    var colCount = table[0].length;
    var rowCount = table.length;
    var i, s, newRow = table[0];
    for (s = 1; s < colCount; s++) {
        newRow[s] = newRow[s] + 1000;
    }
    for (i=1;i<rowCount;i++) {
        for (s=1;s<colCount;s++){
            newRow[s] = newRow[s]*(table[i][s]+1000);
        }
    }
    for (s=1;s<colCount;s++){
        newRow[s] = Math.pow(newRow[s], 1/rowCount)-1000;
    }
    newRow[0] = table[Math.round(table.length/2)][0];
    return newRow;
};
    


History.prototype.getChange = function(startVal, curVal) {
    return (curVal / startVal - 1) * 100;
};

History.prototype.changeInterval = function(newStep, div) {
    this.updateStep = newStep;
    var self = this;
    clearInterval(this.updateInterval);
    this.updateInterval = window.setInterval(function(){self.update();}, self.updateStep*1000); 
    $('#'+div).html(newStep + ' seconds');
};

History.prototype.setInitial = function(initial) {
    for (var key in initial) {
        this.initial[key].last = initial[key];
    }
};






var history = new History();
history.update();
history.start();








