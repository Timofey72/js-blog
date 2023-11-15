import express from 'express'
import multer from 'multer'
import 'dotenv/config'

import { registerValidation, loginValidation } from './validations/auth.js'
import { postCreateValidation } from './validations/post.js'
import { chechAuth } from './utils/authToken.js'
import * as UserRoutes from './routes/user.routes.js'
import * as PostRoutes from './routes/post.routes.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
import checkOwner from './utils/checkOwner.js'

const PORT = process.env.PORT || 8080
const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.post('/upload', chechAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get('/auth/me', chechAuth, UserRoutes.getMe)
app.post('/auth/login', loginValidation, handleValidationErrors, UserRoutes.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserRoutes.register)

app.get('/post/:id', PostRoutes.getOnePost)
app.get('/post', PostRoutes.getPosts)
app.post('/post', chechAuth, postCreateValidation, handleValidationErrors, PostRoutes.createPost)
app.put('/post', chechAuth, checkOwner, PostRoutes.updatePost)
app.delete('/post/:id', chechAuth, checkOwner, PostRoutes.deletePost)

app.listen(PORT, err => {
  if (err) {
    return console.log(err)
  }

  console.log(`server started on port ${PORT}`)
})
