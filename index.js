import express from 'express'
import 'dotenv/config'

import { registerValidation, loginValidation } from './validations/auth.js'
import { postCreateValidation } from './validations/post.js'
import { chechAuth } from './utils/authToken.js'
import * as UserRoutes from './routes/user.routes.js'
import * as PostRoutes from './routes/post.routes.js'

const PORT = process.env.PORT || 8080
const app = express()

app.use(express.json())

app.post('/auth/login', loginValidation, UserRoutes.login)
app.post('/auth/register', registerValidation, UserRoutes.register)
app.get('/auth/me', chechAuth, UserRoutes.getMe)

app.post('/post', postCreateValidation, PostRoutes.createPost)
app.put('/post', postCreateValidation, PostRoutes.updatePost)
app.get('/post/:id', PostRoutes.getOnePost)
app.get('/post', PostRoutes.getPosts)
app.delete('/post/:id', PostRoutes.deletePost)



app.listen(PORT, err => {
  if (err) {
    return console.log(err)
  }

  console.log(`server started on port ${PORT}`)
})
