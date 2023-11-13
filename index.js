import express from 'express'
import 'dotenv/config'

import { registerValidation } from './validations/auth.js'
import { chechAuth } from './utils/authToken.js'
import * as Auth from './controller/auth.controller.js'

const PORT = process.env.PORT || 8080
const app = express()

app.use(express.json())

app.post('/auth/login', Auth.login)

app.post('/auth/register', registerValidation, Auth.register)

app.get('/auth/me', chechAuth, Auth.getMe)

app.listen(PORT, err => {
  if (err) {
    return console.log(err)
  }

  console.log(`server started on port ${PORT}`)
})
