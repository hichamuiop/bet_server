const GameType = require("../models/game_type.model");

const gameTypeController = {};

gameTypeController.saveGameType = async (req, res, next) => {
  const { name, description } = req.body;
  const { user } = req
  const newGameType = new GameType({
    name: name.toUpperCase(),
    description,
  });
  try {
    if (user.role !== "admin" && user.role !== "super_admin") {
        const err = new Error('You are note autorize to add game type');
        err.status = 401;
        throw err;
    }
    const gameType = await newGameType.save();
    return res.send({ gameType });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoServerError") {
      const error = new Error(
        `The ${newGameType.name}  is already exsist`
      );
      error.status = 400;
      next(error);
    } else {
      next(e);
    }
  }
};

gameTypeController.getGameType = async (req, res, next) => {
  try {
      const gameType = await GameType.find();
      return res.send({gameType});
    } catch (e) {
      next(e);
    }
}


module.exports = gameTypeController;
