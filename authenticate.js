var passport=require('passport')
var localStategy= require('passport-local').Strategy
var User=require('./models/user')
var JwtStrategy =require("passport-jwt").Strategy;
var ExtractJwt =require ('passport-jwt').ExtractJwt;
var jwt =require ('jsonwebtoken')
var config=require('./config')
const FacebookTokenStrategy=require('passport-facebook-token')

var Dishes=require('./models/dishes');
const { Strategy } = require('passport-local');
const user = require('./models/user');
const { stringify } = require('qs');
const LocalStrategy = require('passport-local').Strategy; 


exports.local= passport.use(new localStategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken= function(user){
    return jwt.sign(user, config.secretKey,{expiresIn:3600} )
}

const opts = {
    secretOrKey: config.secretKey, // replace with your actual secret or key
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };

 exports.jwtPassport=passport.use(new JwtStrategy(opts,
    (jwt_Payload, done)=>{
        console.log('JWT payload',jwt_Payload)
        User.findOne({_id:jwt_Payload._id},(err,user)=>{
            if(err){
                return done(err,false)
            }
            else if (user){
                return done(null,user)
            }
            else{
                return done(null,false)
            }
        })
    })) 
   
    exports.verifyUser =passport.authenticate('jwt',{session:false})       
               
    exports.verifyAdmin = (req,res,next)=>{
        console.log(req.user)
        if(req.user.admin)
            next();
        else{
            var err=new Error('You are not authorized to perform this operation!');
            err.status=403;
            return next(err);
        }
    };
const options = {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret
}
    exports.FacebookPassport= passport.use(new 
        FacebookTokenStrategy(options,(accessToken,refreshToken,profile,done)=>{
        User.findOne9({facebookId:profile.id},(err,user)=>{
            if(err){
                return done(err,false)
            }if(!err && user !== null){
                return done(null,user)
            }else{
                user=new User({
                    username:profile.displayName
                    })
                user.facebookId=profile.id
                user.firstname=profile.name.givenName
                user.lastname=profile.name.familyName
                user.save((err,user)=>{
                    if(err){
                        return done(err,false)
                    }else{
                        return done(null,user)
                    }
                })
            }
        })
    }
    ))