import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import database from '../database/index.ts';
import { Router } from 'express';
import generateRandomName from './generateRandomName.ts';

const auth = Router();

const URL = process.env.TRUE_URL ? process.env.TRUE_URL : `${process.env.CLIENT_URL}:${process.env.PORT}`;

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${URL}/auth/google/callback`,
  passReqToCallback   : true
},
async function(request: any, accessToken: any, refreshToken: any, profile: any, done: any) {

  try {

    const user = await database.user.upsert({
      where: {
        google_id: profile.id,
      },
      update: {
        google_id: profile.id,
        email: profile.emails[0].value,
        lastLogin: new Date()
      },
      create: {
        google_id: profile.id,
        email: profile.emails[0].value,
        name: generateRandomName()
      }
    });

    await database.user_Settings.upsert({
      where: {
        user_id: user.id,
      },
      update: {
        user_id: user.id,
      },
      create: {
        user_id: user.id,
      }
    });

    return done(null, user);

  } catch (err) {
    return done(err, null);
  }

}
));

passport.serializeUser(function(user: any, cb: any) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.deserializeUser(function(user: any, cb: any) {
  process.nextTick(function() {
    return cb(null, user);
  });
});
auth.get('/login', passport.authenticate('google', {
  scope: ['email', 'openid'],
  prompt: 'select_account consent'
}));

auth.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

export default auth;
