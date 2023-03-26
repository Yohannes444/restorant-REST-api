const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate=require('../authenticate')
const Favorite = require('../models/favorite');
const User = require('../models/user');
const FavoriteRouter = express.Router();

FavoriteRouter.use(bodyParser.json());

FavoriteRouter.route('/')

.get(authenticate.verifyUser,(req,res,next) => {
    Favorite.find({user:req.user._id})
    .populate('favorite.user')
    .populate('favorite.dishes')
    .then((favorite) => {
        if (favorite != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite.user,favorite.dish);
        }
        else {
            err = new Error(' you have no saved favorite dish');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


.post(authenticate.verifyUser,(req,res)=>{
  User.findById(req.user._id)
  .then((user) => {
      if (user != null) {
        Favorite.find({user:req.user._id})
          .then(favorite=>{
            if (favorite !=null){
              for (var i = 0; i < req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push({dish: req.body[i]._id});
                }
            }
            console.log('Favorite updated with new dishes ', favorite);
              favorite.save()
              res.statusCode =200
              res.setHeader('Content-Type','application/json')
              res.json(favorite)
            }else{
             
              Favorite.create({user:req.user._id, dishes:[]})
              .then(favorite=>{
                for (var i = 0; i < req.body.length; i++) {
                  favorite.dishes.push({dish: req.body[i]._id});
              }
              favorite.save()
              })
              .then((favorite) => {
                console.log('Favorite updated with new dishes ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite)
            }, (err) => next(err))
            .cathc(err=>console.error(err))
            }
          })
          .catch((err) => next(err));
        
          
      }
   
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req,res)=>{
  Favorite.find({user:req.user._id})
  .then(favorite=>{
    if(favorite != null){
      Favorite.deleteOne({user:req.user._id})
      .then(favorites=>{
        console.log('Favorites deleted: ', favorites);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      })
    }else {
      console.log('Favorites not found for user: ', req.user._id);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Favorites not found for user ' + req.user._id);
    }
  })
  .catch(err=>res.send(err))
})

FavoriteRouter.route('/:dishId')
.post(authenticate.verifyUser,(req,res)=>{
  Favorite.find({user:req.user._id})
  .then(favorites=>{
    if(favorites !=null){
      if (favorites.dishes.indexOf(dishId) === -1){
        favorites.dishes.push(req.params.dishId)
        favorites.save()
        .then((favorites) => {
          console.log('Dish added to favorites: ', favorites);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorites);
        })
        .catch((err) => next(err));
      }else {
        console.log('Dish already in favorites: ', req.params.dishId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Dish ' + req.params.dishId + ' already in favorites');
      }
    }else {
      // If the user's favorites document does not exist, create one
      Favorite.create({ user: req.user._id, dishes: [req.params.dishId] })
      .then((favorites) => {
        console.log('Favorites created: ', favorites);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      })
      .catch((err) => next(err));
    }
  })
})
.delete(authenticate.verifyUser,(req,res)=>{
  Favorite.findOneAndRemove({user:req.user._id})
  .then(favorites=>{
    if(favorites != null){
      if(favorites.dishes.indexOf(req.params.dishId) === -1){
        console.log("this dish is not in the fovorilt list of the user: ",favorites.user)
        res.statusCode =404;
        res.setHeader('Content-Type','text/plain')
        res.end('favorite not found for user'+req.user._id)
      }else{
        favorites.dishes.splice(index, 1);
        favorites.save()
        .then(favorites=>{
          console.log('the fovorite has been deleted from the user: ',req.user._id,' list of favorite')
          res.statusCode = 200
          res.setHeader('Content-Type','application/json')
          res.end(favorites)
        })
        .catch(err=>console.log(err))
      }
    }else {
      console.log('Favorites not found for user: ', req.user._id);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Favorites not found for user ' + req.user._id);
    }
  })
  .catch(err=>console.log(err))
})
module.exports = FavoriteRouter;



