import mongoose from 'mongoose'

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
    },
    coordinates: {
        type: [Number],
        default: [0, 0],
    },
})

export default locationSchema