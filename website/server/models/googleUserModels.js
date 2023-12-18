const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoogleUserSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        unique: false,
      },
      email: {
        type: String,
        required:true,
      },
      role: {
        type: String,
        default: 'user',
      }
    },
    { timestamps: true }
  );
  
  const GoogleUser = mongoose.model("GoogleUser", GoogleUserSchema);
  
  module.exports = GoogleUser;
  