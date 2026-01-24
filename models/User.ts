import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    // In a real app, hash this password! For this hackathon/demo, simple storage is assumed for now
    // or use NextAuth. Depending on requirements, we might not even need a password if using magic links/OAuth.
    // We'll stick to basic fields for now.
    password: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    jurisdiction_country: {
        type: String,
        required: false, // Optional until onboarding is complete
        default: null
    },
    jurisdiction_state: {
        type: String,
        required: false, // Optional until onboarding is complete
        default: null
    },
    onboarding_complete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = models.User || model('User', UserSchema);

export default User;
