const User = require('../models/userModel');
const multer = require('multer')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'sha256code'

exports.postSignup = async (req, res) => {

    const upload = multer({ dest: './uploads/' })
    upload.single('image')(req, res, async (err) => {
        const { name, email, password } = JSON.parse(req.body.userData)
        if (err) {
            console.log(err.message)
            res.status(500).send({ message: 'Error uploading image' });
        } else {
            const image = req.file;
            const imageUrl = `/uploads/${image.filename}.jpg`;
            try {
                const saltRounds = 10;
                const hashPassword = await bcrypt.hash(password, saltRounds)

                const user = new User({
                    name, email, password: hashPassword,
                    profilePicture: imageUrl
                })
                await user.save()

                res.status(201).json({ message: 'User created successfully' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error creating user' });
            }
        }
    })

}


exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({ message: 'No User Found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ uid: user._id }, SECRET_KEY)
        res.status(200).json({ token, message: 'Login Successful' });
    } catch (err) {
        console.log(err, err.message)
        res.status(500).json({ message: 'Some Error Occured' });
    }
};


exports.getUser = async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { uid } = jwt.verify(authorization, SECRET_KEY);
        const user = await User.findOne({ _id: uid })

        if (!user) {
            return res.status(401).json({ message: 'No User Found' });
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture

        });
    } catch (err) {
        console.log(err, err.message)
        res.status(500).json({ message: 'Some Error Occured' });
    }
};
