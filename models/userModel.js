const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: { type: String, default: "default.jpg" },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

//? PASSWORD ENCRYPTION
userSchema.pre("save", async function (next) {

  //* HASH the password using bcrypt algorithm with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // * We don't need to persist passwordConfirm into DB
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function () {
  this.select( "-__v -email");
});

//? Checking password by instant method
userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword);


const User = mongoose.model("User", userSchema);

module.exports = User;
