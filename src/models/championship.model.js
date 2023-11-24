const mongoose = require('mongoose');



const {Schema} = mongoose

const ChampionshipSchema = Schema({
    name: { type: String, required: true , unique: true },
    image: { type: String },
    national : { type: Boolean , default:false},
    country: { type: Schema.Types.ObjectId, ref: 'Country' },
    teams: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team"
        }
      ]

})


const Championship = mongoose.model('Championship', ChampionshipSchema);
module.exports = Championship;