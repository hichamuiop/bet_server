const mongoose = require('mongoose');



const {Schema} = mongoose

const BetSchema = Schema({
    name: { type: String, required: true },
    description: { type: String },
    bettype: { type: Schema.Types.ObjectId, ref: 'BetType' },
    gametype: { type: Schema.Types.ObjectId, ref: 'GameType' },

})


const Bet = mongoose.model('Bet', BetSchema);
module.exports = Bet;