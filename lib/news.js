var feeds = [
    {
        name: 'The Guardian',
        url:  'http://www.theguardian.com/technology/bitcoin/rss',
        filter: false
    },
    {
        name: 'Washington Post - The Switch',
        url:  'http://feeds.washingtonpost.com/rss/blogs/rss_the-switch',
        filter: true
    },
    {
        name: 'Washington Post',
        url:  'http://feeds.washingtonpost.com/rss/business',
        filter: true
    },
    {
        name: 'Huffington Post',
        url:  'http://www.huffingtonpost.com/tag/bitcoin/feed',
        filter: false
    },
    {
        name: 'New York Times',
        url:  'http://topics.nytimes.com/top/reference/timestopics/subjects/c/currency/index.html?rss=1',
        filter: true
    },
    {
        name: 'CNN Money',
        url:  'http://rss.cnn.com/rss/money_latest',
        filter: true
    },
    {
        name: 'Wired Opinion',
        url:  'http://feeds.wired.com/wiredopinion/',
        filter: true
    },
    {
        name: 'Reddit - Bitcoin',
        url:  'http://www.reddit.com/r/Bitcoin/.rss',
        fitler: false
    },
    {
        name: 'CoindDesk',
        url:  'http://feeds.feedburner.com/CoinDesk',
        filter: false
    },
    {
        name: 'Bitcoin Charts',
        url:  'http://bitcoincharts.com/headlines.rss',
        filter: false
    },
];


var get = function(callback){
    var scrapper = require(__dirname + '/feedscrapper.js');
    var total = Object.keys(feeds).length;
    var current = 0;
    var allContent = [];
    for (var f in feeds) {
        scrapper.scrap(feeds[f].url, (function(feed){
            return function(err, content) {
                if (err === null) {
                    if (feed.filter) {
                        console.log('Filtering: ' + feed.name);
                        content = feedFilter(content);
                    }
                    allContent.push(content);
                }
                current++;
                if (current === total) {
                    callback(allContent);
                }
            };
        })(feeds[f]));
    }
    
};
exports.get = get;


/**
 * Filters a whole feed by keywords in items.title
 * 
 * @param {Object} feed A Feed-Object
 * @returns {Object} The filtered Feed-Object
 */
var feedFilter = function(feed) {
    var keywords = [
            'bitcoin',
            'litecoin'
        ];
    var patt = new RegExp(keywords.join('|'), "gim");
    var newItems = [];
    for (var i in feed.items) {
        if (patt.test(feed.items[i].title)) {
            newItems.push(feed.items[i]);
        }
    }
    feed.items = newItems;
    return feed;
};



