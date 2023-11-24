const mongoose = require('mongoose');

const bcrypt = require('bcryptjs')

const {Schema} = mongoose

const UserSchema = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    image: { type: String },
    password: { type: String, required: true },
    joined: { type: Date, default: new Date() },
    role : { type: String , default:"user" },
    isVerified : {type : Boolean , default : false }
})

UserSchema.pre('save' , async function(next){
    if (!this.isModified('password')) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(this.password , salt);
        this.password = hash;
        next();

    }catch(e){
        return next(e)
    }

    
})

UserSchema.methods.isPasswordMatch = function(password, hashed, callback) {
    bcrypt.compare(password, hashed, (err, success) => {
      if (err) {
        return callback(err);
      }
      callback(null, success);
    });
  };

UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
  };
  

const User = mongoose.model('User', UserSchema);
module.exports = User;