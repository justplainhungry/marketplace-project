// Modules 
const express = require ('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const {getCollection} = require('./models/produce')
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');

// Create 
const app = express();

// Configure
let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://just_hungry:justHungry123@project4.vtmjv6d.mongodb.net/ndba-project4';
app.set('view engine', 'ejs');

// MongoDB
mongoose.connect(url) //{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
    .then(()=>{

        // Run server
        app.listen(port, host, ()=> {
            console.log('Live on port', port);
        });
        
    })
    .catch(err=>console.log(err.message)); // last project issue?

// Middleware
app.use(session({ 
    secret: 'fgdyuaighfdalbjvfjsio', 
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb+srv://just_hungry:justHungry123@project4.vtmjv6d.mongodb.net/ndba-project4' })
}));

app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/items', itemRoutes);
app.use('/users', userRoutes);



// Error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    console.log(err.stack);
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});


