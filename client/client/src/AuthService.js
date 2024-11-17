const User = require(' ../../../model//User');
const jwt = require('jsonwebtoken');

class AuthService {
  static async register(username, password) {
    const user = new User({ username, password });
    await user.save();
    return user;
  }

  static async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    return { user, token };
  }
}

module.exports = AuthService;