const mongoose = require("mongoose");

const { Schema } = mongoose;

const MatchSchema = Schema({
  championship: { type: Schema.Types.ObjectId, ref: "Championship", required: true },
  home_team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  away_team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  date: { type: Date, required: true },
  bet: { type: Schema.Types.ObjectId, ref: "Bet", required: true },
  odd: { type: Number },
  status: { type: String, default: "IN PROGRESS" },
  score: {
    home_score: {
      type: Number,
    },
    away_score: {
      type: Number,
    },
  },
  Difficulty_level: { type: String, default: "EASY" },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Match = mongoose.model("Match", MatchSchema);
module.exports = Match;
