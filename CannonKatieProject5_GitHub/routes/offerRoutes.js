
const express = require('express');
const controller = require('../controllers/offerController');
const {isLoggedIn} = require('../middlewares/auth');

const router = express.Router({mergeParams: true}); //access data from parents

// POST /produce/:id/offers : User creates a new offer object for an item
router.post('/', isLoggedIn, controller.newOffer);

// GET /profile/:id/offers : view all offers recieved on an item listed on the user's profile
router.get('/offers', isLoggedIn, controller.allOffers);

// PUT /profile/:id/offers/:offerID : accept one offer on an item and reject all others
router.put('/offers/:offerID', isLoggedIn, controller.acceptOffer);


module.exports = router;