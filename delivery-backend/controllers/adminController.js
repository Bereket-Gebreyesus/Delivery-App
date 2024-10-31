import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Hotel from "../models/hotelModel.js";

const getAllAdmins = asyncHandler(async(req, res) => {
    try {
        const admins = await User.find({
            role: "admin",
        }).sort({ created: -1 });
        if (!admins) {
            res.status(404);
            throw new Error("Error fetching admins");
        }
        res.status(201).json(admins);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCustomers = asyncHandler(async(req, res) => {
    try {
        const customers = await User.find({ role: "customer" }).sort({ created: -1 });
        if (!customers) {
            res.status(404);
            throw new Error("Error fetching customers");
        }
        res.status(201).json(customers);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllRestaurants = asyncHandler(async(req, res) => {
    try {
        const resturants = await Hotel.find({ role: "hotelOwner" }).sort({ created: -1 });
        if (!resturants) {
            res.status(404);
            throw new Error("Error fetching resturants");
        }
        res.status(201).json(resturants);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllDeliveryPersons = asyncHandler(async(req, res) => {
    try {
        const deliveryPerson = await User.find({ role: "deliveryPerson" }).sort({ created: -1 });
        if (!deliveryPerson) {
            res.status(404);
            throw new Error("Error fetching delivery guys");
        }
        res.status(201).json(deliveryPerson);
    } catch (error) {
        throw new Error(error);
    }
});
export { getAllAdmins, getAllCustomers,getAllRestaurants,getAllDeliveryPersons };