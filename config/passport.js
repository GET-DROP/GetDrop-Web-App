const Googlestrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
const User2 = require("../models/User2")
const localStrategy= require("passport-local").Strategy;


module.exports = function (passport) {
  passport.use(
    new Googlestrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://getdrop.cyclic.app/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken,profile);
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value, //NEW these are all properties provided by google
          // mail: profile.emails,
        });

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else { 
            newUser.save();
            //user.save()      remove if session problems are not fixed
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
        }
      }
    )),
    passport.use(
      new localStrategy(function(email,password,done){
       User2.findOne({email:email}).then((user)=>{ 
            if(!user){
              return done(null,false,{message:'This Email is not Registered'})
            }
            bcryptjs.compare(password,user.password,(err,isMatch)=>{
              if(err) throw err;
              if(isMatch){
                return done(null,user);
              }
              else{
                return done(null,false,{message:"password is incorrect"})
              }
            })
        }).catch(err=>console.error(err))
      })
    );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};

