const Match = require("../models/match.model");
const Team = require("../models/team.model");
const Bet = require("../models/bet.model");
const Championship = require("../models/championship.model");

const matchController = {};

matchController.saveMatch = async (req, res, next) => {
  const { championship_id, home_team_id, away_team_id, date, bet_id, odd } =
    req.body;
  const { user } = req;
  const championship = await Championship.findById(championship_id);
  const home_team = await Team.findById(home_team_id);
  const away_team = await Team.findById(away_team_id);
  const bet = await Bet.findById(bet_id);
  const newMatch = new Match({
    championship,
    home_team,
    away_team,
    date,
    bet,
    odd,
    owner: user,
  });
  try {
    if (user.role !== "admin" && user.role !== "super_admin") {
      const err = new Error("You are note autorize to add team");
      err.status = 401;
      throw err;
    }
    const match = await newMatch.save();
    return res.send({ match });
  } catch (e) {
    next(e);
  }
};

matchController.getMatch = async (req, res, next) => {
  const today = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 2);

  try {
    const match = await Match.find({
      date: {
        $gte: new Date(threeDaysAgo),
        $lte: new Date(tomorrow),
      },
    })
      .populate({
        path: "championship",
        populate: { path: "country" },
      })
      .populate({
        path: "bet",
        populate: { path: "bettype" },
      })
      .populate({
        path: "bet",
        populate: { path: "gametype" },
      })
      .populate("home_team")
      .populate("away_team");
    return res.send({ match });
  } catch (e) {
    next(e);
  }
};

matchController.addScore = async (req, res, next) => {
  const match_id = req.params.match_id;
  const { score, status } = req.body;
  try {
    const match = await Match.updateOne({ _id: match_id }, { score, status });
    return res.send({
      success: true,
      match,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = matchController;
