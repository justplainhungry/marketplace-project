const Produce = require('../models/produce');
const User = require('../models/user')

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        let err = new Error('Unathorized to access the resouce');
        err.status = 401;
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
}

// check if user is authenticated
exports.isLoggedIn = (req, res, next)=> {
    if(req.session.user) {
        return next();
    } else {
        let err = new Error('Unathorized to access the resouce');
        err.status = 401;
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
}

// check if user is selling the item
exports.isAuthor = (req, res, next) =>{
    let id = req.params.id;
    Produce.findById(id)
    .then(item=>{
        if(item) {
            if(item.author == req.session.user) {
                return next();
            } else {
                let err = new Error('Unathorized to access the resouce');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.isSeller = (req, res, next) => {
    const id = req.params.id; 
    const userId = req.session.user; 

    Produce.findById(id)
        .then(item => {
            if (!item) {
                const err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                return next(err);
            }

            // Check if the current user is the seller of the item
            if (item.seller.toString() === userId) {
                // User is the seller, allow access
                return next();
            } else {
                // User is not the seller, deny access
                const err = new Error('You are unauthorized to alter this item');
                err.status = 401;
                return next(err);
            }
        })
        .catch(err => next(err));
};
/*
if(req.session.user !== item.seller){ //make a new auth function called isNotSeller to check if the user is the seller
    let offer = new Offer(req.body); 
    offer.save()
    .then(offer=>{
        //update the item's highest bid 
        
        //increment the total offers 
        
     
        req.flash('success', 'Offer Submitted!');
        res.redirect('/items/' + id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/items/' + id);
        }
        next(err);
    });
    
} else {
    let err = new Error('You cannot make an offer on your own listing.')
    err.status = 401;
    next(err);
}
//res.send('Place a new offer');*/