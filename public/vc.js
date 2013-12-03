
(function() {
    $(document).ready(function() {
        
        $( "#sliderUpdateInterval" ).slider({
            range: "max",
            min: 2,
            max: 60,
            value: 5,
            slide: function( event, ui ) {
                history.changeInterval(parseInt(ui.value,10), 'labelUpdateInterval');
            }
        });
        
    });
})();








