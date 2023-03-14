var passport=require('passport')
var localStategy= require('passport-local').Strategy
var User=require('./models/user')
var JwtStrategy =require("passport-jwt").Strategy;
var ExtractJwt =require ('passport-jwt').ExtractJwt;
var jwt =require ('jsonwebtoken')
var config=require('./config')
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
var opts ={}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey =config.secretKey



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
    

    exports.jwtPassport=passport.use(new JwtStrategy(opts,
        (jwt_Payload, done)=>{
            console.log('JWT payload',jwt_Payload)
            User.findOne({_id:jwt_Payload._id},(err,user)=>{
                if(err){
                    return done(err,false)
                }
                else if (user.admin){
                    return done(null,user)
                }
                else{
                    return done(null,false)
                }
            })
        })) 
                     
    exports.verifyadmin =passport.authenticate('local',{session:false})


