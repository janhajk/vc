var config   = require(__dirname + '/config.js');
var express  = require('express');
var path     = require('path');
var fs       = require('fs');
var BTCE     = require('btce');

var db       = require(__dirname + '/database/database.js');
var news     = require(__dirname + '/lib/news.js');

var app = express();
app.configure(function(){
  app.use(express.compress());
  app.set('port', process.env.PORT || config.port);
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Asynchronous
var auth = express.basicAuth(function(user, pass, callback) {
 var result = (user === config.username && pass === config.password);
 callback(null /* error */, result);
});

app.get('/', auth, function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf-8', function (err, data) {
        res.send(data);
    });
});



app.get('/ticker/update', auth, function(req, res) {
    var btceTrade = new BTCE(config.btce_key, config.btce_sign);
    var pairs = {
        ltc_btc: undefined,
        btc_usd: undefined,
        ltc_usd: undefined
    };
    for (var pair in pairs) {
        btceTrade.ticker({ pair: pair }, (function(pair){
            return function(err, data) {
                if (err) throw err;
                else {
                    pairs[pair] = data.ticker.last;
                    var finish = true;
                    for (var key in pairs) {
                        if (pairs[key] === undefined) {
                            finish = false;
                            break;
                        }
                    }
                    if (finish) res.json(pairs);
                }
            }
        })(pair));
    }
});

app.get('/news', auth, function(req, res){
    news.get(function(news){
        res.json(news);
    });
});

//db.connect(function(){
    app.listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
//});
