const { default: mongoose } = require('mongoose');
const Poll = require('../models/pollModel');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const SECRET_KEY = 'sha256code'

exports.savepoll = async (req, res) => {
    try {
        const { title, options } = req.body;
        const { authorization } = req.headers;
        const { uid } = jwt.verify(authorization, SECRET_KEY);
        const convertedOptions = options.map(option => ({
            option,
            votes: 0
        }))
        if (!title || !options) {
            return res.status(400).send({ message: 'Title and options are required' });
        }

        const poll = new Poll({ title, options: convertedOptions, });
        const response = await poll.save();
        const user = await User.findOne({ _id: uid })

        user.createdPolls.push(response._id)
        await user.save()
        res.status(201).send({ message: 'Poll created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error creating poll' });
    }
};

exports.getAllpoll = async (req, res) => {
    try {
        const polls = await Poll.find();
        res.status(200).send(polls);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching polls' });
    }
};

exports.getMypoll = async (req, res) => {
    try {
        const { authorization } = req.headers
        const { uid } = jwt.verify(authorization, SECRET_KEY);
        const user = await User.findOne({ _id: uid })
        res.status(200).send({ mypoll: [...user.createdPolls] });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching polls' });
    }
};

exports.getPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).send({ message: 'Poll not found' });
        }
        res.status(200).send(poll);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Some error occured' });
    }
};

exports.putVote = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        const { authorization } = req.headers
        if (!poll) {
            return res.status(404).send({ message: 'Poll not found' });
        }

        const { uid } = jwt.verify(authorization, SECRET_KEY);
        const user = await User.findOne({ _id: uid })

        user.votedPolls.push(poll._id)
        await user.save()


        const optionId = req.body.optionId;
        if (!optionId) {
            return res.status(400).send({ message: 'Option ID is required' });
        }

        const option = poll.options.find((option) => option._id.toString() === optionId);
        if (!option) {
            return res.status(404).send({ message: 'Option not found' });
        }

        option.votes += 1

        if (!poll.votes.includes(user._id)) {
            poll.votes.push(user._id)
            // poll.votes.push(req.params.id);
            const updatedPoll = await poll.save();
            res.status(200).send({ updatedPoll, message: `You voted for ${option.option}` });
        } else {
            res.status(200).send({ message: 'You have voted already' })
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error updating poll' });
    }
};

// exports.getResults = (req, res) => {
//     Poll.findById(req.params.id, (err, poll) => {
//         if (err) {
//             res.status(404).send(err);
//         } else {
//             res.send(poll.votes);
//         }
//     });
// }