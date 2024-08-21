const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    createdPolls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poll'
        }
    ],
    votedPolls: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poll'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);