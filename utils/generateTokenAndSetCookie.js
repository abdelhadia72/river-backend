import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userID ) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: '10m'
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000, // 10 minutes
    sameSite: 'strict'
  });

  return token;
}
