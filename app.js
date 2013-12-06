var config   = require(__dirname + '/config.js');
var express  = require('express');
var path     = require('path');
var fs       = require('fs');
var stock    = require(__dirname + '/lib/stock.js');

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


app.get('/ticker/:n', auth, function(req, res){
    stock.tickerN(req.param('n'), function(error, data){
        res.json(data);
    });
});

app.get('/ticker/last/:n', auth, function(req, res){
    stock.lastN(req.param('n'), function(error, data){
        res.json(data);
    });
});





app.get('/depth/update', auth, function(req, res){
    stock.depth(function(data){
        res.json(data);
    });
});

app.get('/news', auth, function(req, res){
    news.get(function(news){
        res.json(news);
    });
});

db.connect(function(){
    app.listen(app.get('port'));
    stock.startCron(config.updateInterval !== undefined ? config.updateInterval : 2000);
});
