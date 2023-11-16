import bcrypt from 'bcrypt';

import userController from '../controller/user.controller.js';
import { encryptPassword } from '../utils/encryptionPassword.js';
import { createToken } from '../utils/authToken.js';

export const register = async (req, res) => {
  const passwordHash = await encryptPassword(req.body.password);

  userController
    .createUser(req, passwordHash)
    .then((data) => {
      const userData = data.rows[0];

      const token = createToken(userData);

      res.json({ ...userData, token });
    })
    .catch(() => {
      res.status(500).json({ error: 'Не удалось зарегистрироваться' });
    });
};

export const getMe = (req, res) => {
  userController
    .getOneUser(req)
    .then((data) => {
      const userData = data.rows;
      if (userData.length === 0) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      res.json(userData[0]);
    })
    .catch(() => {
      res.status(500).json({ error: 'Произошла ошибка' });
    });
};

export const login = (req, res) => {
  userController
    .getOneUser(req, true)
    .then(async (data) => {
      let userData = data.rows;
      if (
        userData.length === 0 ||
        !(await bcrypt.compare(req.body.password, userData[0].password_hash))
      ) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
      }

      userData = userData[0];
      const token = createToken(userData);

      res.json({ ...userData, token });
    })
    .catch(() => {
      res.status(500).json({ error: 'Не удалось авторизоваться' });
    });
};
