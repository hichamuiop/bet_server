const Team = require("../models/team.model");
const Country = require("../models/country.model");
const Championship = require("../models/championship.model");
const teamController = {};

teamController.saveTeam = async (req, res, next) => {
  const { name, country_id, championship_id } = req.body;
  const { user, file } = req;
  const country = await Country.findById(country_id);
  const championships = await Championship.findById(championship_id);
  const newTeam = new Team({
    name: name.toUpperCase(),
    image: (file && file.filename) || null,
    country,
  });
  try {
    if (user.role !== "admin" && user.role !== "super_admin") {
      const err = new Error("You are note autorize to add team");
      err.status = 401;
      throw err;
    }
    const findTeam = await Team.findOne({ name: newTeam.name });
    if (findTeam && !findTeam.championships.includes(championship_id)) {
      await Team.updateMany(
        { _id: findTeam._id },
        { $push: { championships: championships } }
      );
      await Championship.updateMany(
        { _id: championship_id },
        { $push: { teams: findTeam } }
      );
      const message = `${findTeam.name} is modified at ${championships.name}`;
      return res.send({ message: message });
    }
    const team = await newTeam.save();
    await Team.updateMany(
      { _id: team._id },
      { $push: { championships: championships } }
    );
    await Championship.updateMany(
      { _id: championship_id },
      { $push: { teams: team } }
    );
    return res.send({ team });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoServerError") {
      const error = new Error(`The ${newTeam.name} team is already exsist`);
      error.status = 400;
      next(error);
    } else {
      next(e);
    }
  }
};

teamController.getTeam = async (req, res, next) => {
  try {
    const team = await Team.find()
      .populate("country")
      .populate({
        path: "championships",
        populate: { path: "country" },
      });
    return res.send({ team });
  } catch (e) {
    next(e);
  }
};

teamController.updateTeam = async (req, res, next) => {
  const team_id = req.params.team_id;
  const {file} = req
  const e_team = await Team.findById(team_id)

  const image =  e_team.image ? ((file && file.filename) || e_team.image) : ((file && file.filename) || null)

  const { name } = req.body;

  try {
    const team = await Team.updateOne(
      { _id: team_id },
      { 
        name : name , 
        image : image
      }
    );
    return res.send({
      success: true,
      team,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = teamController;
