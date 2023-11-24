const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const bet = require("./routes/bet");
const path = require("path");

// -----------DB Config --------------- //

mongoose.connect(process.env.MONGO_DB_URL); 
mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});
mongoose.connection.on("error", (err) => {
  console.log(`failed to connect : ${err}`);
});

// ----------- Middelwares --------------- //

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// ----------- Routes --------------- //

app.use("/api/bet", bet);




// ----------- Public Images -----------//

app.use(express.static("public"));

// ----------- Static Files --------------- //


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../../frontend", "build", "index.html")
    );
  });
}



// ----------- ERRORS --------------- //

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || "Error processing your request";
  res.status(status).send({
    error,
  });
});

module.exports = app;



