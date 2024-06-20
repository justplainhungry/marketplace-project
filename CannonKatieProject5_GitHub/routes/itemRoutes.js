const express = require('express');
const router = express.Router();
const { upload } = require('./fileUpload');
const controller = require('../controllers/itemController');
const {isLoggedIn, isSeller} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');
const offerRoutes = require('./offerRoutes'); // hook up the offerRoutes

// GET /items: send all available items to the user
router.get('/', controller.index);

// GET /items/new: send html form for creating a new item listing
router.get('/new', isLoggedIn, controller.new);

// POST /items: create a new item listing
router.post('/', isLoggedIn, upload, controller.create);

// GET /items/:id: send details of an item listing identified by id
router.get('/:id', validateId, controller.show);

// GET /items/:id/edit: send html for editing an existing item listing
router.get('/:id/edit', validateId, isSeller, controller.edit);

// PUT /items/:id: update the item listing identified by id
router.put('/:id', validateId, isLoggedIn, isSeller, upload, controller.update);

// DELETE /items/:id: delete the item listing identified by id
router.delete('/:id', validateId, isLoggedIn, isSeller, controller.delete);

router.use('/:id/offers', offerRoutes);

module.exports = router;