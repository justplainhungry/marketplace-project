const multer = require('multer');
const model = require('../models/produce');
const user = require('../models/user');

// Displays all the items from Browse or Start Browsing
exports.index = (req, res, next) => {
    let searchQuery = req.query.search;
    let query = {active: true}; 

    if (searchQuery) {
        query.$or = [
                {title: {$regex: searchQuery, $options: 'i' }}, 
                {details: {$regex: searchQuery, $options: 'i'}}
            ]
    };

    model.find(query)
        .then(produce => {
            // Sorting produce by price
            produce.sort((a, b) => a.price - b.price);
            res.render('./items/index', { produce });
        })
        .catch(err => {
            console.error(err);
            next(err); 
        });
};

// Sends the page for creating a new item
exports.new = (req, res) => {
   res.render('./items/new');
};

// Creates a new item in the array
exports.create = (req, res, next) => {
    let item = new model(req.body); 
    item.seller = req.session.user;
    if(req.file) {
        item.image = './images/' + req.file.filename; 
    }
    item.save()
        .then((item)=> {
            console.log(item);
            req.flash('success', 'Listing posted successfully');
            res.redirect('/items');
        })
        .catch(err=> {
            if(err.name === 'ValidationError'){ 
                err.status = 400;
            } 
            next(err);
        });
};

// Sends the details of an item by id
exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item=>{
        if (item) {
            res.render('./items/item', { produce: item });
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

// Sends the HTML form to edit an item by id
exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then( item=>{
        if (item) {
            res.render('./items/edit', {item});
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        } 
    })
    .catch(err=>next(err));
};

// Update an item based on its id
exports.update = (req, res, next) => {
    let item = req.body;
    let id = req.params.id;

    if (req.file) {
        item.image = './images/' + req.file.filename;
    }

    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item=>{
        if (item) {
            req.flash('success', 'Listing changed successfully');
            res.redirect('/items/' + id);
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError'){
            err.status = 400;
        } 
        next(err);
    });
};

// Deletes a produce item based on its id
exports.delete = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(item=>{
        if (item) {
            req.flash('success', 'Listing deleted successfully');
            res.redirect('/items');
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};