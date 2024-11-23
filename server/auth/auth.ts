import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import database from '../db/index.ts';
import { Router } from 'express';

const auth = Router();

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.CLIENT_URL}:${process.env.PORT}/auth/google/callback`,
  passReqToCallback   : true
},
async function(request, accessToken, refreshToken, profile, done) {

  try {

    const user = await database.user.upsert({
      where: {
        google_id: profile.id,
      },
      update: {
        google_id: profile.id,
        email: profile.emails[0].value
      },
      create: {
        google_id: profile.id,
        email: profile.emails[0].value
      }
    });

    return done(null, user);

  } catch (err) {
    return done(err, null);
  }

}
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});
auth.get('/login', passport.authenticate('google', {
  scope: ['email', 'openid'],
  // prompt: 'select_account consent'
}));

auth.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

export default auth;
