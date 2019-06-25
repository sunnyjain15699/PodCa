const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const router = express.Router();
const passport = require('passport')
// Load Idea Model 
require('../models/User');
const User = mongoose.model('users');


// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Login  from Post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideaz',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Register From POST
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Please enter matching password' })
    }
    if (req.body.password.length < 6) {
        errors.push({ text: 'Please enter Password length greater than 6' })
    }
    if (!req.body.name) {
        errors.push({ text: 'Please add a name' });
    }
    if (!req.body.email) {
        errors.push({ text: 'Please add correct email' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
                .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already exist')
                    res.redirect('/users/register')
                } else {

                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return
                                });
                            });
                          });
                        }
                      });
                  }
                });
                
                        
    // Register Users Route
    router.get('/register', (req, res) => {
        res.render('users/register')
    })

    // logout User
    router.get('/logout',(req,res) => {
        req.logout();
        req.flash('success_msg','You are logged out');
        res.redirect('/users/login')
    })

    module.exports = router;