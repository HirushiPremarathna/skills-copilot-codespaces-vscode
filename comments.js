//Create web server
//1. npm init
//2. npm install --save express
//3. npm install --save body-parser
//4. npm install --save mongoose
//5. npm install --save mongoose-currency
//6. npm install --save morgan
//7. npm install --save multer

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Comment = require('../models/comment');

var commentRouter = express.Router();
commentRouter.use(bodyParser.json());

commentRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.find(req.query)
        .populate('postedBy')
        .exec(function(err, comment){
            if(err) throw err;
            res.json(comment);
    });
})

.post(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.create(req.body, function(err, comment){
        if(err) throw err;
        console.log('Comment created!');
        var id = comment._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the comment with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req,res,next){
    Comment.remove({}, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});

commentRouter.route('/:commentId')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.findById(req.params.commentId)
        .populate('postedBy')
        .exec(function(err, comment){
            if(err) throw err;
            res.json(comment);
    });
})

.put(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.findByIdAndUpdate(req.params.commentId, {
        $set: req.body
    }, {
        new: true
    }, function(err, comment){
        if(err) throw err;
        res.json(comment);
    });
})

.delete(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.findByIdAndRemove(req.params.commentId, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});

module.exports = commentRouter;
