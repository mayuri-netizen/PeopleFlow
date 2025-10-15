import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures no two users can have the same email
            trim: true,
            lowercase: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true, // Ensures mobile number is unique
        },
        address: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female'], // Restricts the value to be one of these
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        profile: {
            type: String,
            required: true,
        },
    },

    {
        // Automatically adds createdAt and updatedAt fields
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;