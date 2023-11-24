const mongoose = require('mongoose');



const {Schema} = mongoose

const BetTypeSchema = Schema({
    name: { type: String, required: true  },
    description: { type: String },
    gametype: { type: Schema.Types.ObjectId, ref: 'GameType' },

})


const BetType = mongoose.model('BetType', BetTypeSchema);
module.exports = BetType;