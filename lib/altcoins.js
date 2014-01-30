// replies: https://bitcointalk.org/index.php?board=159.0;sort=replies;desc
// cryptsy requests: https://cryptsy.freshdesk.com/support/discussions/forums/191571/recent

var config = require(__dirname + '/../config.js');
var https  = require('https');
var db     = require(__dirname + '/../database/database.js');

var getCoins = function(callback) {
    db.altcoins.altcoin.find({}, function(err, docs){
        callback(docs);
    });
};
exports.getCoins = getCoins;

var getPageContent = function(i, callback) {
    i = parseInt(i*40, 10);
    var url = 'https://bitcointalk.org/index.php?board=159.'+i+';sort=views;desc';
    https.get(url, function (res) {
        var body = '';
        res.on('data', function(d) {
            body += d;
        });
        
        res.on('end', function() {
            if (!body || res.statusCode !== 200) return callback('No content or not Status 200');
            else {
                callback(null, body);
            }
        });
    }).on('error', function (error) {
                console.log('error while getting feed', error);
                callback(error, null);
    });
};

var parseSite = function(html) {
    var table  = [];
    var tables = html.match(/<table.*>([\s\S]*?)<\/table>/g);
    var rows   = tables[5].match(/<tr.*>([\s\S]*?)<\/tr>/g);
    var cells;
    for (var i = 1; i < rows.length; i++) {
        cells = rows[i].match(/<td.*>([\s\S]*?)<\/td>/g);
        cells[0] = cells[2].match(/<a href="([\s\S]*?)">/);
        cells[0] = cells[0][1].match(/topic=(\d*?)\./);
        cells[0] = cells[0][1];
        for (var r=1; r < cells.length; r++) {
            cells[r] = cells[r].replace(/<\/?[^>]+(>|$)|[\n\t]/g, "");
        }
        table.push([
            parseInt(cells[0],10),
            cells[2],parseInt(cells[4],10),
            parseInt(cells[5],10),
            cells[6]
        ]);
    }
    return table;
};

var updateCoin = function(fid, title, trend, callback) {
    db.altcoins.altcoin.find({forum: fid}, function (err, docs) {
        var altcoin;
        if (docs.length) {
            altcoin = docs[0];
            console.log('Forum already exists; updating...');
        }
        else {
            altcoin = new db.altcoins.altcoin();
            altcoin.forum = fid;
            altcoin.ft = title;
            console.log('new forum entry; creating...');
        }
        altcoin.trend.push(trend);
        altcoin.save(function(err, product){
            //console.log(product);
            callback(true);
        });
    });
};

var getTable = function(callback) {
    getPageContent(0, function(error, body){
        var table = parseSite(body);
        getPageContent(1, function(error, body){
            table = table.concat(parseSite(body));
            getPageContent(2, function(error, body){
                table = table.concat(parseSite(body));
                callback(error, table);
            });
        });
    });
};

var cron = function(callback) {
    getTable(function(error, table){
        var rows = table.length;
        var done  = 0;
        for (var i in table) {
            updateCoin(
                table[i][0],
                table[i][1],
                {
                    t: parseInt(Date.now()/1000, 10),
                    v: table[i][3],
                    r: table[i][2],
                    cv: 0
                },
                function(){
                    done++;
                    if (done >= rows) callback(true);
                });
        }
    });
};

var startCron = function(interval) {
    cron(function(f){});
    console.log('starting cron bitcointalk trends...');
    setInterval(cron, interval);
};
exports.startCron = startCron;




