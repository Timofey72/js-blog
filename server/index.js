import express from 'express';
import multer from 'multer';
import 'dotenv/config';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations/index.js';

import { UserRoutes, PostRoutes } from './routes/index.js';

import { chechAuth, handleValidationErrors, checkPermissions } from './utils/index.js';

const PORT = process.env.PORT || 8080;
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', chechAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/auth/me', chechAuth, UserRoutes.getMe);
app.post('/auth/login', loginValidation, handleValidationErrors, UserRoutes.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserRoutes.register);

app.get('/post/:id', PostRoutes.getOnePost);
app.get('/post', PostRoutes.getPosts);
app.post('/post', chechAuth, postCreateValidation, handleValidationErrors, PostRoutes.createPost);
app.put('/post', chechAuth, checkPermissions, PostRoutes.updatePost);
app.delete('/post/:id', chechAuth, checkPermissions, PostRoutes.deletePost);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`server started on port ${PORT}`);
});
