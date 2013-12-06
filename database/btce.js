var mongoose = require('mongoose');
  
  
var btceTickerSchema = mongoose.Schema({
    t: {type: Number, index: true},
    d: [{
        t : {type: String}, // type
        h : {type: Number}, // high
        m : {type: Number}, // low/min
        a : {type: Number}, // avg
        v : {type: Number}, // vol
        c : {type: Number}, // vol_cur
        l : {type: Number}, // last
        b : {type: Number}, // buy
        s : {type: Number}, // sell
    }],
});

var ticker = mongoose.model('btceTicker', btceTickerSchema);
exports.ticker = ticker;

