const express = require('express');
const router = express.Router();
const pollController = require('../controller/pollController')

router.post('/', pollController.savepoll);

router.get('/allpolls', pollController.getAllpoll);

router.get('/mypolls', pollController.getMypoll);

router.get('/:id', pollController.getPoll);

router.put('/:id/vote', pollController.putVote);


module.exports = router;