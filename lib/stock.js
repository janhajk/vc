var config = require(__dirname + '/../config.js');
var https  = require('https');
var BTCE   = require('btce');
var db     = require(__dirname + '/../database/database.js');

var tickerPairs = [
        'btc_usd',
        'ltc_btc',
        'nmc_btc',
        'nvc_btc',
        'trc_btc',
        'ppc_btc',
        'ftc_btc',
        'ltc_usd',
        'nmc_usd',
        'xpm_btc',
    ];

var depthPairs = {
    //ltc_btc: undefined,
    //btc_usd: undefined,
    //ltc_usd: undefined,
    //ppc_btc: undefined,
    ftc_btc: undefined
};


var lastN = function(n, callback) {
    if (n.parseInt === 1) {
        callback(null, [{
            t: btceLast.t,
            l: getLastFromTimeRow(btceLast)
        }]);
    }
    else {
        var query = db.btce.ticker.find({}, 't d.t d.l').sort('-t').limit(n);
        query.exec(function(err, rows) {
            var data = {};
            var key1, key2;
            rows.sort(function(a,b){a=a.t;b=b.t;return (a>b)?1:(a<b?-1:0);});
            for (key1=0;key1<rows.length;key1++) {
                for (key2=0;key2<rows[key1].d.length;key2++) {
                    if (data[rows[key1].d[key2].t] === undefined) data[rows[key1].d[key2].t] = [];
                    data[rows[key1].d[key2].t].push([
                        rows[key1].t,               // timestamp
                        rows[key1].d[key2].l        // last
                    ]);
                }
                
            }
            callback(err, data);
        });
    }
};
exports.lastN = lastN;



/**
 * @param {Object} timeRow
 * {
    "t": 1386157402986,
    "_id": "529f155a9be798fb18005dca",
    "__v": 0,
    "d": [
      {
        "t": "btc_usd",
        "h": 1041.26794,
        "m": 968.67999,
        "a": 1004.973965,
        "v": 12198715.58113,
        "c": 12153.7075,
        "l": 1037.83,
        "b": 1039,
        "s": 1037.83,
        "_id": "529f155a9be798fb18005dd1"
      },
      {},....]
   }
   
 * @returns {Object} 
 * {btc_usd: 1020.12, ltc_btc: 0.00032, ...}
 * 
 */
var getLastFromTimeRow = function(timeRow) {
    var last = {};
    for (var t in timeRow.d) {
        last[timeRow.d[t].t] = timeRow.d[t].l;
    }
    return last;
};


var tickerN = function(n, callback) {
    if (n.parseInt === 1) {
        callback(null, btceLast);
    }
    else {
        var query = db.btce.ticker.find().sort('-t').limit(n);
        query.exec(function(err, rows) {
            rows.sort(function(a,b){a=a.t;b=b.t;return (a>b)?1:(a<b?-1:0);});
            callback(err, rows);
        });
    }
};
exports.tickerN = tickerN;



// var lastNByType = function(n, type, callback) {
//     var query = db.btce.ticker.find({type: type}).sort('-updated').limit(n);
//     query.exec(function(err, rows) {
//         var data = [];
//         for (var r in rows) {
//             data.push([rows[r].updated*1000, rows[r].last]);
//         }
//         data.sort(function(a,b){a=a[0];b=b[0];return (a>b)?1:(a<b?-1:0);});
//         callback(err, data);
//     });
// };
// exports.lastNByType = lastNByType;



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




var btceLast;

var updateTicker = function() {
    ticker(function(error, data){
        if (error === null) {
            var rows = [];
            for (var key in data) {
                rows.push({
                    t : key,
                    h : data[key].high,
                    m : data[key].low,
                    a : data[key].avg,
                    v : data[key].vol,
                    c : data[key].vol_cur,
                    l : data[key].last,
                    b : data[key].buy,
                    s : data[key].sell
                });
            }
            btceLast = {
                t: (new Date()).getTime(),
                d: rows
            };
            var btceTicker = new db.btce.ticker(btceLast);
            btceTicker.save();
        }
    });
};


var startCron = function(interval) {
    console.log('starting cron...');
    setInterval(updateTicker, interval);
};
exports.startCron = startCron;



var ticker = function(callback) {
    var url = 'https://btc-e.com/api/3/ticker/';
    url = url + tickerPairs.join('-');
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







