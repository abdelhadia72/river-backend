import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId ) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'  })

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000, // 10 minutes
    sameSite: 'strict'
  });

  return token;
}
