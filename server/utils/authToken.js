import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

export const createToken = (userData) => {
  return jwt.sign(
    {
      _id: userData.id,
    },
    SECRET_KEY,
    {
      expiresIn: '30d',
    }
  );
};

const chechAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: 'Нет доступа' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.body.userId = decoded._id;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Нет доступа' });
  }
};

export default chechAuth;
