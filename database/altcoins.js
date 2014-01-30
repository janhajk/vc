var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var altcoinsTrendsSchema = new Schema({
    t:  {type: Number, index: true},     // timestamp (linux)
    v:  {type: Number, index: true},     // viewcount
    r:  {type: Number, index: true},     // repliescount
    cv: {type: Number, index: true}      // Votes on cryptsy requests
});

  
var altcoinsSchema = new Schema({
    name:  {type: String, index: true},   // Bitcoin, Quarkcoin, etc.
    short: {type: String, index: true},   // BTC, LTC, QBIT, etc.
    type:  {type: String, index: true},   // sha512, scrypt, quark, qubit, etc.
    forum: {type: String, index: true},   // Topic-ID bitcointalk
    ft:    {type: String, index: false},  // Title in the Forum
    cry:   {type: String, index: false},  // Cryptsy request Topics-ID
    start: {type: Date,   index: false},  // Start Date (Date when of first entry)
    www:   {type: String, index: false},  // Website (official Website of coin)
    active:{type: Boolean,index: true},   // active = true, not active = false
    trend: [altcoinsTrendsSchema]
});

var altcoin = mongoose.model('altcoin', altcoinsSchema);
exports.altcoin = altcoin;

