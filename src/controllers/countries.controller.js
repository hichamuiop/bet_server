const Country = require("../models/country.model");

const countryController = {};

countryController.saveCountry = async (req, res, next) => {
  const { name } = req.body;
  const { user , file} = req

  const newCountry = new Country({
    name: name.toUpperCase(),
    image: (file && file.filename) || null
  });
  try {
    if (user.role !== "admin" && user.role !== "super_admin") {
        const err = new Error('You are note autorize to add country');
        err.status = 401;
        throw err;
    }
    const country = await newCountry.save();
    return res.send({ country });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoServerError") {
      const error = new Error(
        `The ${newCountry.name} country is already exsist`
      );
      error.status = 400;
      next(error);
    } else {
      next(e);
    }
  }
};

countryController.getCountry = async (req, res, next) => {
  try {
      const country = await Country.find().sort('name');
      return res.send({country});
    } catch (e) {
      next(e);
    }
}


countryController.updateCountry = async (req, res, next) => {
  const country_id = req.params.country_id;
  const {file} = req
  const e_country = await Country.findById(country_id)
  
  const image =  e_country.image ? ((file && file.filename) || e_country.image) : ((file && file.filename) || null)
  const { name } = req.body;

  try {
    const country = await Country.updateOne(
      { _id: country_id },
      { name : name , image : image }
    );
    return res.send({
      success: true,
      country,
    });
  } catch (e) {
    next(e);
  }
};



module.exports = countryController;
