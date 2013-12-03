var config = require(__dirname + '/../config.js');
var https  = require('https');
var BTCE   = require('btce');

var tickerPairs = {
    ltc_btc: undefined,
    btc_usd: undefined,
    ltc_usd: undefined,
    ppc_btc: undefined,
    ftc_btc: undefined
};

var depthPairs = {
    //ltc_btc: undefined,
    //btc_usd: undefined,
    //ltc_usd: undefined,
    //ppc_btc: undefined,
    ftc_btc: undefined
};


var ticker = function(callback) {
    var pairs = [
        'btc_usd',
        'ltc_btc',
        'nmc_btc',
        'nvc_btc',
        'trc_btc',
        'ppc_btc',
        'ftc_btc'
    ];
    var url = 'https://btc-e.com/api/3/ticker/';
    url = url + pairs.join('-');
    https.get(url, function (res) {
        var body = '';
        res.on('data', function(d) {
            body += d;
        });
        
        res.on('end', function() {
            if (!body || res.statusCode !== 200) return callback('No content or not Status 200');
            else {
                callback(null, JSON.parse(body));
            }
        });
    }).on('error', function (error) {
                console.log('error while getting feed', error);
                callback(error, null);
    });
};
exports.ticker = ticker;


var depth = function(callback) {
    var pairs = depthPairs;
    var btceTrade = new BTCE(config.btce_key, config.btce_sign);
    for (var pair in pairs) {
        btceTrade.depth({ pair: pair }, (function(pair){
            return function(err, data) {
                if (err) throw err;
                else {
                    pairs[pair] = data;
                    var finish = true;
                    for (var key in pairs) {
                        if (pairs[key] === undefined) {
                            finish = false;
                            break;
                        }
                    }
                    if (finish) callback(pairs);
                }
            };
        })(pair));
    }
};
exports.depth = depth;