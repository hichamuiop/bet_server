const mongoose = require('mongoose');



const {Schema} = mongoose

const TeamSchema = Schema({
    name: { type: String, required: true , unique: true},
    image: { type: String },
    country: { type: Schema.Types.ObjectId, ref: 'Country' },
    championships: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Championship"
        }
      ]
})

const Team = mongoose.model('Team', TeamSchema);
module.exports = Team;