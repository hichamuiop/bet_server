const BetType = require("../models/bet_type.model");
const GameType = require("../models/game_type.model");
const betTypeController = {};

betTypeController.saveBetType = async (req, res, next) => {
  const { name, description, gametype_id } = req.body;
  const { user } = req;
  try {
    if (user.role !== "admin" && user.role !== "super_admin") {
      const err = new Error("You are note autorize to add championship");
      err.status = 401;
      throw err;
    }

    gametype_id.map(async (item) => {
      const gametype = await GameType.findById(item);
      const bettypes = await BetType.findOne({ gametype: item, name: name });
      if (!bettypes) {
        const newBetType = new BetType({
          name: name.toUpperCase(),
          description,
          gametype,
        });
        await newBetType.save();
      }
    });
    return res.send({ message: "succece" });
  } catch (e) {
    next(e);
  }
};

betTypeController.getBetType = async (req, res, next) => {
  try {
    const betType = await BetType.find().populate("gametype");
    return res.send({ betType });
  } catch (e) {
    next(e);
  }
};

module.exports = betTypeController;
