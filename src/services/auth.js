import jwt from 'jsonwebtoken';

import constants from '../config/constants';
import User from '../models/User';

export async function requireAuth(user) {
  if (!user || !user._id) {
    throw new Error('Unauthorized!');
  }

  // without this stuff "old" token still work, i.e. can create tweets...
  const me = await User.findById(user._id);

  if (!me) {
    throw new Error('Unauthorized!');
  }

  return me;
}

export function decodeToken(token) {
  const arr = token.split(' ');

  // just for additional security, we add a string before the real token
  // this way a attacker must know this small inside knowledge to access something...
  if (arr[0] === 'Bearer') {
    return jwt.verify(arr[1], constants.JWT_SECRET);
  }

  throw new Error('Token not valid!');
}
