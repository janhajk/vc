// readers from: http://www.ebizmba.com/articles/news-websites
// and wikipedia
var feeds = [
    {
        name: 'The Guardian',
        url:  'http://www.theguardian.com/technology/bitcoin/rss',
        filter: false,
        readers: 9,
        followersG: 2.5,
        indicator: 10
    },
    {
        name: 'Washington Post - The Switch',
        url:  'http://feeds.washingtonpost.com/rss/blogs/rss_the-switch',
        filter: true,
        readers: 37,
        followersG: 1.5,
        indicator: 8
    },
    {
        name: 'Washington Post',
        url:  'http://feeds.washingtonpost.com/rss/business',
        filter: true,
        readers: 37,
        followersG: 1.5,
        indicator: 10
    },
    {
        name: 'Huffington Post',
        url:  'http://www.huffingtonpost.com/tag/bitcoin/feed',
        filter: false,
        readers: 85,
        followersG: 1.8,
        indicator: 10
    },
    {
        name: 'New York Times',
        url:  'http://topics.nytimes.com/top/reference/timestopics/subjects/c/currency/index.html?rss=1',
        filter: true,
        readers: 60,
        followersG: 1.8,
        indicator: 10
    },
    {
        name: 'Financial Times',
        url:  'http://www.ft.com/rss/home/us',
        filter: true,
        readers: 2.2,
        followersG: 2.4,
        indicator: 6
    },
    {
        name: 'CNN Money',
        url:  'http://rss.cnn.com/rss/money_latest',
        filter: true,
        readers: 70,
        followersG: 0.6,
        indicator: 5
    },
    {
        name: 'Wired Opinion',
        url:  'http://feeds.wired.com/wiredopinion/',
        filter: true,
        readers: 0,
        followersG: 2.6,
        indicator: 6
    },
    {
        name: 'Reddit - Bitcoin',
        url:  'http://www.reddit.com/r/Bitcoin/.rss',
        fitler: false,
        readers: 0,
        followersG: 0,
        indicator: 2
    },
    {
        name: 'CoindDesk',
        url:  'http://feeds.feedburner.com/CoinDesk',
        filter: false,
        readers: 0,
        followersG: 844/1000000,
        indicator: 3
    },
    {
        name: 'Bitcoin Charts',
        url:  'http://bitcoincharts.com/headlines.rss',
        filter: false,
        readers: 0,
        followersG: 0,
        indicator: 4
    },
    {
        name: 'Bitcoin.org',
        url:  'http://bitcoin.org/en/rss/alerts.rss',
        filter: false,
        readers: 0,
        followersG: 0,
        indicator: 0
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
            'litecoin',
            'feathercoin',
            'peercoin',
            'primecoin'
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



