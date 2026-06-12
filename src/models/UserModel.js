import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trime: true,
        minLenght: 6,
        maxLenght: 254
    },
    password: {
        type: String,
        required: true,
        minLenght: 8,
        maxLenght: 254
    },
    username: {
        type: String,
        default: '',
        required: true,
        trim: true,
        minLenght: 3,
        maxLenght: 20
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },


})

export default mongoose.model('User', UserSchema)