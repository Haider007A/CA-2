const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

// Define the schema for a user
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  gamesWon: {
    type: Number,
    default: 0,
  },
  gamesLost: {
    type: Number,
    default: 0,
  },
  gamesDrawn: {
    type: Number,
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
// Add passport-local-mongoose to User schema and create a model
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
