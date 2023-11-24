const mongoose = require('mongoose');



const {Schema} = mongoose

const GameTypeSchema = Schema({
    name: { type: String, unique : true, required : true},
    description: { type: String,},

})

const GameType = mongoose.model('GameType', GameTypeSchema);
module.exports = GameType;