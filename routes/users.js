var express = require('express');
var bodyParser =require('body-parser')
var user =require('../models//user')
var authenticate=require('../authenticate')
var passport=require('passport');
var router = express.Router();
router.use(bodyParser.json())
/* GET users listing. */
router.get('/',authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
  user.find({})
  .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/signup', (req, res,next) => {
  user.register(new user({username: req.body.username}),
  req.body.password,(err,user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err})
      
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
        
      if (req.body.lastname)
        user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            next(err)
            return ;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        })
    }
  })

});

router.post('/login',passport.authenticate('local'), (req,res,next) => {
  var token =authenticate.getToken({_id:req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success:true ,token:token  ,status: 'your are successfuly logdin',});
  next()
})

router.get('/logout', (req, res,next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err)
  }
});

module.exports = router;
