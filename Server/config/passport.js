var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

//Import User Model
 var User = require("../models/User");
 var Score = require("../models/Score");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
      //Match User to username
      User.findOne({ username: username })
        .then(user => {
          if(!user) {
            return done(null, false, { message: 'That User does not exist.' });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;

            if(isMatch) {
              return done(null, user);
            }else{
              return done(null, false, { message: 'Password Incorrect.' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
