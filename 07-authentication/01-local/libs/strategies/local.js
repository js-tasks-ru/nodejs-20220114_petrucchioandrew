const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const [user] = await User.find({email});

      if (!user) {
        done(null, false, 'Нет такого пользователя');
        return;
      }

      const isAuthenticate = await user.checkPassword(password);
      if (!isAuthenticate) {
        done(null, false, 'Неверный пароль');
        return;
      }

      done(null, user);
    },
);
