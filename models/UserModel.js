const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number (E.164 format)",
      ],
    },
    dob: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // Remove sensitive fields
        delete ret.__v;
        delete ret.password;

        // Reorder fields
        return {
          _id: ret._id,
          name: ret.name,
          email: ret.email,
          phoneNumber: ret.phoneNumber,
          dob: ret.dob,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
