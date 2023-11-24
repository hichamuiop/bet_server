const Bet = require("../models/bet.model");
const BetType = require("../models/bet_type.model");
const GameType = require("../models/game_type.model");
const mongoose = require("mongoose");

const betController = {};

betController.saveBet = async (req, res, next) => {
  const { name, description, bettype_name } = req.body;
  const { user } = req;
  const bettype = await BetType.find({
    name: bettype_name.toUpperCase(),
  }).populate("gametype");
  try {
    if (user.role !== "admin" && user.role !== "super_admin") {
      const err = new Error("You are note autorize to add team");
      err.status = 401;
      throw err;
    }
    bettype.map(async (item) => {
      const bet = await Bet.findOne({
        name: name.toUpperCase(),
        bettype: item._id,
        gametype: item.gametype._id,
      });
      if (!bet) {
        const newBet = new Bet({
          name: name.toUpperCase(),
          description: description + " IN " + item.gametype.name,
          bettype: item,
          gametype: item.gametype,
        });
        await newBet.save();
      }
    });

    return res.send({ message: "succece" });
  } catch (e) {
    next(e);
  }
};

betController.getBet = async (req, res, next) => {
  try {
    const bet = await Bet.find().populate("bettype").populate("gametype");
    return res.send({ bet });
  } catch (e) {
    next(e);
  }
};

module.exports = betController;
