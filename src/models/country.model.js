const mongoose = require('mongoose');



const {Schema} = mongoose

const CountrySchema = Schema({
    name: { type: String, unique : true, required : true},
    image: { type: String },
})

const Country = mongoose.model('Country', CountrySchema);
module.exports = Country;