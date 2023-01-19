const mongoose = require("mongoose");
const Userschema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("googleUsers", Userschema);
