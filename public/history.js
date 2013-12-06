var History = function() {
    
    var self = this;
    
    this.urlUpdate = '/ticker/last/';
    
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
    
    this.start = function() {
       //this.updateInterval = window.setInterval(function(){}, self.updateStep*1000);
    };
    

};

History.prototype.changeInterval = function(newStep, div) {
    this.updateStep = newStep;
    var self = this;
    clearInterval(this.updateInterval);
    this.updateInterval = window.setInterval(function(){self.update();}, self.updateStep*1000); 
    $('#'+div).html(newStep + ' seconds');
};
