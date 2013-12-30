$( document ).ready(function() {
    
    
    /**
     * Change Initial Values
     */
    var settingsSetRate = function(rate) {
    
        var div    = document.createElement('div');
        
        var label = document.createElement('span');
        label.textContent = rate + ':';
        label.style.width = '90px';
        label.style.float = 'left';
        var input  = document.createElement('input');
        input.style.marginLeft = '10px';
        
        var button = document.createElement('button');
        button.textContent = 'set';
        button.onclick = function() {
            ratesInitial[rate] = parseFloat(input.value); 
            history1.destroy();
            history1.load();
            $('#content').tabs({active: 0});
        };
        
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(button);
        return div;
    };
    
    (function() {
        settingsRate();
        function settingsRate() {
            if (history1.last1 !== null) {
                var div = document.createElement('div');
                div.textContent = 'Set initial Values:';
                div.style.marginTop = '20px';
                for (var key in history1.last1) {
                    div.appendChild(settingsSetRate(key));
                }
                $('#tabs-3').append(div);
            }
            else {
                setTimeout(settingsRate, 2000);
            }
        }
    })();
    
    /**
     * Change Number of History entries to load
     */
    (function() {
        var div = document.createElement('div');
        div.textContent = 'Numbers of History Values to load:';
        div.style.marginTop = '20px';
        var input  = document.createElement('input');
        input.style.marginLeft = '10px';
        input.value = '10000';
        var button = document.createElement('button');
        button.textContent = 'set';
        button.onclick = function() {
            history1.historyBack = parseFloat(input.value); 
            history1.destroy();
            history1.load();
            $('#content').tabs({active: 0});
        };
        div.appendChild(input);
        div.appendChild(button);
        $('#tabs-3').append(div);
    })();
    
        
    $( "#sliderUpdateInterval" ).slider({
        range: "max",
        min: 2,
        max: 60,
        value: 5,
        slide: function( event, ui ) {
            history1.cronSetNew(parseInt(ui.value,10));
        }
    });
        
});