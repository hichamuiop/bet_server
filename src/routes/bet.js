const express = require("express");

const passport = require("passport");
const countryController = require("../controllers/countries.controller");
const championshipController = require("../controllers/championship.controller");
const userController = require("../controllers/users.controller");
const teamController = require("../controllers/teams.controller");
const gameTypeController = require("../controllers/game_type.controller");
const betTypeController = require("../controllers/bet_type.controller");
const betController = require("../controllers/bet.controller");
const matchController = require("../controllers/match.controller");
const multer = require("multer");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/users", userController.getusers);
router.get("/getmatch", matchController.getMatch);

// Multer Config

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage }).single("image");

router.all("*", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const error = new Error("You are not authorized to access this area");
      error.status = 401;
      throw error;
    }

    //
    req.user = user;
    return next();
  })(req, res, next);
});

const isAdmin = (req, res, next) => {
  // Check if the user has the admin role
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    const error = new Error("You are not authorized to access this area");
    error.status = 401;
    throw error;
  }
  next();
};
// loged to profile
router.get("/loggedprofile", userController.loggedprofile);
// country requests //
router.post("/savecountry", isAdmin , upload, countryController.saveCountry);
router.get("/getcountry", isAdmin , countryController.getCountry);
router.put(
  "/updatecountry/:country_id",
  isAdmin , 
  upload,
  countryController.updateCountry
);
// championship requests //
router.post(
  "/savechampionship",
  isAdmin , 
  upload,
  championshipController.saveChampionship
);
router.get("/getchampionship", isAdmin , championshipController.getChampionShip);
router.put(
  "/updatechampionship/:championship_id",
  isAdmin , 
  upload,
  championshipController.updateChampionship
);
router.put(
  "/addttoc/:championship_id",
  isAdmin , 
  championshipController.addTeamsToChampionship
);
// team requests //
router.post("/saveteam", isAdmin ,  upload, teamController.saveTeam);
router.get("/getteam", isAdmin , teamController.getTeam);
router.put("/updateteam/:team_id", isAdmin , upload, teamController.updateTeam);
// game type requests //
router.post("/savegametype", isAdmin , gameTypeController.saveGameType);
router.get("/getgametype", isAdmin , gameTypeController.getGameType);
// bet type requests //
router.post("/savebettype", isAdmin , betTypeController.saveBetType);
router.get("/getbettype", isAdmin , betTypeController.getBetType);
// bet requests //
router.post("/savebet", isAdmin , betController.saveBet);
router.get("/getbet", isAdmin , betController.getBet);
// match requests //
router.post("/savematch", isAdmin , matchController.saveMatch);
router.put("/addscore/:match_id", isAdmin , matchController.addScore);

module.exports = router;
