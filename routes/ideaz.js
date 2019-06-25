const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');


// Load Idea Model 
require('../models/IIdea');
const Idea = mongoose.model('ideas');


// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(idease => {
            res.render('ideaz/index', {
                idea_see: idease
            });
        });
})



// Form valid
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a Title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add breif details' });
    }

    if (errors.length > 0) {
        res.render('ideaz/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details

        });
    } else {

        const newUser = {

            title: req.body.title,
            details: req.body.details,
            user: req.user.id

        }

        new Idea(newUser)
            .save()
            .then(ideaz => {
                req.flash('success_msg', 'Podcast idea Added')
                res.redirect('/ideaz')
            });
    }
});




//Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideaz/add');
});



//Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideaz/edit', {
                    ideass: idea
                });
            }
        })
});



// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Podcast idea Removed')
            res.redirect('/ideaz');
        })
})



// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Podcast idea Updated')
                    res.redirect('/ideaz')
                })
        })
})

// exports
module.exports = router;

