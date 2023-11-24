const Championship = require("../models/championship.model");
const Country = require("../models/country.model")
const Team = require("../models/team.model")
const championshipController = {};

championshipController.saveChampionship = async (req, res, next) => {
  const { name , national , country_id , teams} = req.body;
  const { user , file } = req
  const country = await Country.findById(country_id);
  const newChampionship = new Championship({
    name: name.toUpperCase(),
    image: (file && file.filename) || null,
    national,
    country,
    teams
  });
  try {
    if (user.role !== "admin" && user.role !== "super_admin") {
        const err = new Error('You are note autorize to add championship');
        err.status = 401;
        throw err;
    }
    const championship = await newChampionship.save();
    return res.send({ championship });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoServerError") {
      const error = new Error(
        `The ${newChampionship.name} is already exsist`
      );
      error.status = 400;
      next(error);
    } else {
      next(e);
    }
  }
};

championshipController.getChampionShip = async (req, res, next) => {
  try {
      const championships = await Championship.find().populate('country').populate('teams').sort('name');
      return res.send({championships});
    } catch (e) {
      next(e);
    }
}


championshipController.updateChampionship = async (req, res, next) => {
  const championship_id = req.params.championship_id;
  const {file} = req
  const e_championship = await Championship.findById(championship_id)

  const image =  e_championship.image ? ((file && file.filename) || e_championship.image) : ((file && file.filename) || null)

  const { name } = req.body;

  try {
    const country = await Championship.updateOne(
      { _id: championship_id },
      { 
        name : name , 
        image : image
      }
    );
    return res.send({
      success: true,
      country,
    });
  } catch (e) {
    next(e);
  }
};

championshipController.addTeamsToChampionship = async (req, res, next) => {
  const championship_id = req.params.championship_id;
  const {teams_id } = req.body
  const championship = await Championship.findById(championship_id)

  try {
    teams_id.map(async (team) => {
      const e_team = await Team.findById(team)
      await Team.updateMany(
        { _id: team },
        { $push: { championships: championship } }
      );
      await Championship.updateMany(
        { _id: championship_id },
        { $push: { teams: e_team } }
      );
    })
    return res.send({ message: "update succece" });

  }catch (e) {
    next(e)
  }
}


module.exports = championshipController;