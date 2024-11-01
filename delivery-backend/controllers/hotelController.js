import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";
import Hotel from "../models/hotelModel.js";
const registerHotel = asyncHandler(async (req, res) => {
  try {
    const {
      email,
      name,
      password,
      phone,
      lat,
      lng,
      locationName,
      description,
      telegram,
    } = req.body;
    const imagesFromReq = req.files;
    const images = await uploadToCloudinary(imagesFromReq);
    if (images.length == 0) {
      res.status(400);
      throw new Error("Error uploading images");
    }

    const phoneExists = await Hotel.findOne({ phone });
    const emailExists = await Hotel.findOne({ email });

    if (phoneExists) {
      res.status(400);
      throw new Error("Hotel with this phone already exists");
    }
    if (emailExists) {
      res.status(400);
      throw new Error("Hotel with this phone already exists");
    }

    const hotel = await Hotel.create({
      name,
      email,
      password,
      description,
      telegram,
      images,
      phone,
      locationName: locationName,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      role: "hotelOwner",
    });

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
  } catch (error) {
    throw new Error(error);
  }
});
const deleteHotelById = asyncHandler(async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      res.status(404);
      throw new Error("Restaurant not found");
    }
    res.status(200);
    res.json({
      msg: "Restaurant deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getRestaurantProfile = asyncHandler(async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.hotel._id);
    if (!hotel) {
      res.status(404);
      throw new Error("Restaurant not found");
    }
    res.json(hotel);
  } catch (error) {
    throw new Error(error);
  }
});

export { registerHotel, deleteHotelById, getRestaurantProfile };