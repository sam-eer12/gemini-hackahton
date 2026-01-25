import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
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
        required: false,
        default: null
    },
    jurisdiction_state: {
        type: String,
        required: false,
        default: null
    },
    onboarding_complete: {
        type: Boolean,
        default: false
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    verified_at: {
        type: Date,
        required: false,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = models.User || model('User', UserSchema);

export default User;
