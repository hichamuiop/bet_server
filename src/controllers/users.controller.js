const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "hicham.shop.49@gmail.com",
    pass: "zizsroymmbighwgl",
  },
  secure: true,
});

const userController = {};

userController.register = async (req, res, next) => {
  const { name, email, password, joined, image, role, isVerified } = req.body;
  const newUser = new User({
    name,
    email,
    password,
    joined,
    image,
    role,
    isVerified,
  });
  try {
    const user = await newUser.save();
    // const info = await transporter.sendMail({
    //     from: '"HICHAM RAHAI" <hicham.shop.49@gmail.com>', // sender address
    //     to: "hichamfati98@gmail.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    //   });
    
    //   console.log("Message sent: %s", info.messageId);
    return res.send({ user });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoServerError") {
      const error = new Error(
        `Email address ${newUser.email} is already taken`
      );
      error.status = 400;
      next(error);
    } else {
      next(e);
    }
  }
};

userController.login = async (req, res, next) => {
  // usernama & password request
  const { email, password } = req.body;
  try {
    // check if match
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error(`The email ${email} was not found on our system`);
      err.status = 401;
      return next(err);
    }
    user.isPasswordMatch(password, user.password, (err, success) => {
      if (success) {
        //get token
        const secret = process.env.JWT_SECRET;
        const expire = process.env.JWT_EXPIRATION;

        const token = jwt.sign({ _id: user._id }, secret, {
          expiresIn: expire,
        });
        return res.send({ token });
      }
      res.status(401).send({
        error: "Invalid username/password combination",
      });
    });
  } catch (e) {
    next(e);
  }

  //get token
};

userController.getusers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.send({
      users,
      // statistics,
    });
  } catch (e) {
    next(e);
  }
};

userController.loggedprofile = (req, res, next) => {
  const { user } = req;
  res.send({ user });
};

module.exports = userController;
