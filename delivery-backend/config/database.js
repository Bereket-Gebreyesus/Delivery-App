import mongoose from 'mongoose'

const connectDB = async() => {
    try {
        const db =
            process.env.NODE_ENV === 'development' ?
            process.env.MONGO_URI :
            process.env.MONGO_URI_LOCAL

        const conn = await mongoose.connect(db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,

        })

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}

export default connectDB