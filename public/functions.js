/**
 * Geometric Mean of last nth elements of an array
 * 
 * @param {Array} data An Array containing data
 * @param {Number} index index of array to get geometric mean from
 * @param {Number} last The nth last Elements from the array
 */
var geometricMean = function(data, index, last) {
    var i;
    var len = data.getNumberOfRows();
    if (last > len) last = len;
    var gMittel = data.getValue(0, index)+1000;
    for (i = len-last+1; i < len; i++) {
        gMittel = gMittel * (data.getValue(i, index)+1000);
    }
    return Math.pow(gMittel, 1/last)-1000;
};



var increaseBrightness = function(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
};


var dateFormatYMD = function(d) {
    return  [d.getFullYear(),
            (d.getMonth()+1).padLeft(),
             d.getDate().padLeft()].join('/')+
              ' ' +
            [d.getHours().padLeft(),
             d.getMinutes().padLeft()].join(':');
};


Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}


