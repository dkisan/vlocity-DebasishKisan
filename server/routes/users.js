const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

router.post('/signup', userController.postSignup);

router.post('/login', userController.postLogin);

router.get('/getuser',userController.getUser)

module.exports = router;




