import asyncHandler from "express-async-handler";
import Hotel from "../models/hotelModel.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";

const registerHotel = asyncHandler(async (req, res) => {
  const { email, name, password, phone, lat, lng, locationName, description, telegram } = req.body;

  // Step 1: Check for existing phone and email
  const phoneExists = await Hotel.findOne({ phone });
  const emailExists = await Hotel.findOne({ email });

  if (phoneExists) {
    res.status(400);
    throw new Error("Hotel with this phone already exists");
  }
  if (emailExists) {
    res.status(400);
    throw new Error("Hotel with this email already exists");
  }

  // Image upload
  const imagesFromReq = req.files;
  const images = await uploadToCloudinary(imagesFromReq);
  if (images.length === 0) {
    res.status(400);
    throw new Error("Error uploading images");
  }

  console.log("Validation passed and images uploaded");
});
export { registerHotel };