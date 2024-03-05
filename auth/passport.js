const bcrypt = require("bcryptjs");
LocalStrategy = require("passport-local").Strategy;

//Load model
const User = require("../models/userModel");

const loginCheck = passport => {
  passport.use(
    new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
      //Check customer

      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            console.log("wrong username");
            return done(null);
          }

          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;
            if (isMatch) {
              return done(null, user);
            } else {
              console.log("Wrong password");
              return done(null);
            }
          });
        })
        .catch((error) => console.log(error));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};

module.exports = {
  loginCheck,
};