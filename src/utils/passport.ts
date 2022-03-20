const passport = require("passport");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const dotenv = require("dotenv");

dotenv.config();
// Create local strategy
const localOptions = { usernameField: "email" };
const User = mongoose.model("User");
const localLogin = new LocalStrategy(
  localOptions,
  async (
    email: string,
    password: string,
    done: (err?: Error | null, user?: any, info?: any) => void
  ) => {
    // Verify this email and password, call done with the user
    // if it is the correct email and password
    // otherwise, call done with false
    await User.findOne({ email: email }, (err: Error, user: typeof User) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      // compare passwords - is `password` equal to user.password?
      user.comparePassword(password, (err: Error, isMatch: boolean) => {
        if (err) {
          return done(err);
        }

        if (!isMatch) {
          return done(null, false);
        }

        return done(null, user);
      });
    });
  }
);

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.jwtSecret,
};
const jwtLogin = new JwtStrategy(jwtOptions, (payload: any, done: any) => {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findById(payload.sub, (err: Error, user: typeof User) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
