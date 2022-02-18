const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, `Не указан email`);
  }

  let user = await User.findOne({email});

  if (user) {
    return done(null, user);
  } else {
    user = await new User({email, displayName})
      .save()
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  }
};
