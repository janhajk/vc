(function() {
    $(document).ready(function() {
        
        var targetDiv = '#news';
        
        
        var update = function() {
            $.getJSON('/news', function(data){
                var items = [], i, key;
                for (key in data) {
                    for (i in data[key].items) {
                        items.push(data[key].items[i]);
                    }
                }
                // sort items by pubdate descending
                items.sort(function(a,b){var a=Date.parse(a.pubdate);b=Date.parse(b.pubdate);return (a>b)?-1:(a<b?1:0);});
                $(targetDiv).html('<ul></ul>');
                for(i in items) {
                    $('#news ul').append(htmlOneLine(items[i]));
                }
            });
        };     
        update();
        setInterval(update, 5*1000*60);
        
        
        var htmlOneLine = function(item) {
            var li = document.createElement('li');
            
            var div = document.createElement('div');
            div.className = 'newsItem';
            
            var divIcon = document.createElement('div');
            var url = item.link === undefined ? '' : ((item.link.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i))[1]).replace(/\./g, '_');
            divIcon.className = 'iconNews iconNews_' + url;
            
            var divTitle = document.createElement('a');
            divTitle.textContent = item.title;
            divTitle.href = item.link;
            divTitle.className = 'hyperlink';
            
            var divTime = document.createElement('div');
            var pubdate = new Date(item.pubdate);
            divTime.textContent = dateFormatYMD(pubdate);
            divTime.className = 'timestamp';
            var now = new Date();
            now.setTime(now.getTime() - (60*60*1000)); // now minus an hour
            if (pubdate > now) {
                divTime.textContent = 'NEW: ' + divTime.textContent ;
                divTime.style.color = 'red';
            }
            
            div.appendChild(divTime);
            div.appendChild(divIcon);
            div.appendChild(divTitle);
            li.appendChild(div);
            return li;
        };
    });
    
    
})();