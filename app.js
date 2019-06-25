const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport')

const app = express();


// Load routes
const ideaz = require('./routes/ideaz');
const user =  require('./routes/users');
// const users = require('./routes/users')

// Passport Config
require('./config/passport')(passport);

// Db config
const db = require('./config/database')

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURI, { 
    useNewUrlParser: true 
    }).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));




// MiddleWare working
// app.use((req,res,next)=>{
//         req.name="Brad mothfucking Gine";
//         next();
// });


// Middleware for express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// middleware connect-flash
app.use(flash());

// Global Variabbles
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;  
    next();
})

// Middleware Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Middleware body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname,'public')));

// Middlewaere for method over-ride
app.use(methodOverride('_method'));


// index route
app.get('/', (req, res) => {
    const titl = `Welcome`;
    res.render('index', {
        title_changed :titl
    });
});

//About route
app.get('/about', (req, res) => {
    const about = "This is about Us"
    res.render('about', {
        about_changed : about
    });
});

// Use routes
app.use('/ideaz', ideaz);
app.use('/users', user)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on  port ${port}`);
});




