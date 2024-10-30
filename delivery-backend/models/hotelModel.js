import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import locationSchema from "./locationSchema.js";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    telegram: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
   
    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      minlength: 5,
      unique: true,
      maxlength: 50,
    },

    locationName: {
      type: String,
      default: "Unknown",
    },
    role:{
     
      type: String,
      default: "hotelOwner",
    },
    location: locationSchema,
    created: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

hotelSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

hotelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

hotelSchema.index({
  location: "2dsphere",
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
