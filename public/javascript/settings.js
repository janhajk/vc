$( document ).ready(function() {
    
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
        var div = document.createElement('div');
        div.textContent = 'Set initial Values:';
        div.style.marginTop = '10px';
        div.appendChild(settingsSetRate('btc_usd'));
        div.appendChild(settingsSetRate('ltc_btc'));
        div.appendChild(settingsSetRate('nmc_btc'));
        div.appendChild(settingsSetRate('ftc_btc'));
        div.appendChild(settingsSetRate('nvc_btc'));
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