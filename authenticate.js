var passport=require('passport')
var localStategy= require('passport-local').Strategy
var user=require('./models/user')

exports.local= passport.use(new localStategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())