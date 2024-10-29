import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import locationSchema from "./locationSchema.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,

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
    location: locationSchema,
    role: {
        enum: ["admin", "customer","deliveryPerson"],
        type: String,
        default: "customer",
    },
    created: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.index({
    location: "2dsphere",
});

const User = mongoose.model("User", userSchema);

export default User;