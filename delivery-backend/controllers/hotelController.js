import asyncHandler from "express-async-handler";
import Hotel from "../models/hotelModel.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";
import generateToken from "../utils/generateToken.js"; // Include the token generation

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

  // Step 2: Prepare hotel data for insertion
  const hotelData = {
    name,
    email,
    password,
    description,
    telegram,
    images,
    phone,
    locationName,
    location: {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    },
    role: "hotelOwner",
  };

  console.log("Hotel data prepared for insertion");

  // Step 3: Create hotel and send response
  const hotel = await Hotel.create(hotelData);

  if (hotel) {
    res.status(201).json({
      _id: hotel._id,
      name: hotel.name,
      description: hotel.description,
      telegram: hotel.telegram,
      email: hotel.email,
      images: hotel.images,
      phone: hotel.phone,
      locationName: hotel.locationName,
      location: hotel.location.coordinates,
      role: hotel.role,
      token: generateToken(hotel._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid hotel data");
  }
});
export { registerHotel };