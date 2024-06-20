const Offer = require('../models/offer');
const User = require('../models/user');
const item = require('../models/produce');

// Create and save a new offer on an item by a user to the database
exports.newOffer = async (req, res, next) => {
    try { 
        let id = req.params.id;
        let offer = new Offer(req.body);  
        console.log(req.body);
        // Save the new offer
        await offer.save();

        // Update the corresponding item with the new offer details
        await item.findByIdAndUpdate(id, {
            $inc: { totalOffers: 1 },
            $max: { highestOffer: req.body.amount }
        });

        // Flash success message and redirect
        req.flash('success', 'Offer Submitted!');
        res.redirect('/items/' + id);
    } catch(err) {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    }
};

// show all the offer objects users created on their item
exports.allOffers = (req, res, next) => {
    // show all the offers on an item 
    Offers.find(offers)
    .then(offer => {
        res.render(' (offers page for an item) ', { offer });
    })
    .catch(err => {
        console.error(err);
        next(err);
    });
    res.send('Show all offers')
};

exports.acceptOffer = (req, res, next) => {
    // item :id is involved somehow with offer :id

    // Some loop that passes through each object and 
    // changes its status to rejected unless it's the id of 
    // the offer that's been selected.

    // error handling
    res.send('Accept an offer')
};

