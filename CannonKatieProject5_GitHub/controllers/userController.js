const model = require('../models/user');
const Produce = require('../models/produce');
const Offer = require('../models/offer');

exports.new = (req, res)=>{
    if(!req.session.user)
        return res.render('./user/new');
    else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

exports.create = (req, res, next)=>{
    if(!req.session.user) {
        let user = new model(req.body);
        user.save()
        .then(user=> {
            req.flash('success', 'Account successfully created');
            res.redirect('/users/login');
        })
        .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        
        next(err);
        }); 
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email; 
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Produce.find({seller: id}) ]) // not correct Offer.find({_id: id})
    .then(listings=>{
        const [user, produce] = listings;
        res.render('./user/profile', {user, produce});
    })
    /*
    .then(offered=>{
        const [offers] = offered;
        res.render('./user/profile', {offers});
    })*/
    .catch(err=>next(err));

    
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };
