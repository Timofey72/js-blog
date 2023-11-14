import { validationResult } from 'express-validator'

import postController from '../controller/post.controller.js'

const checkPosts = (res, data) => {
  let postData = data.rows
  if (postData.length === 0) {
    return res.status(404).json({ message: 'Ничего не найдено' })
  }

  return postData[0]
}

export const createPost = async (req, res) => {
  console.log(req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  postController
    .createPost(req)
    .then(data => {
      res.json(data.rows[0])
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' })
    })
}

export const updatePost = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  // get post
  postController
    .getOnePost(req)
    .then(data => {
      const postData = checkPosts(res, data)

      if (req.body.userId !== postData.user_id) {
        return res.status(403).json({ message: 'Нет доступа' })
      }

      // update post
      postController
        .updatePost(req)
        .then(data => {
          res.json(postData)
        })
        .catch(() => {
          res.status(500).json({ message: 'Произошла ошибка' })
        })
    })
    .catch(err => {
      res.status(500).json({ message: `Произошла ошибка: ${err}` })
    })
}

export const getOnePost = (req, res) => {
  // get post
  postController
    .getOnePost(req)
    .then(data => {
      const postData = checkPosts(res, data)

      // update views_count
      postData.views_count += 1
      const fakeReq = {
        body: {
          id: postData.id,
          viewsCount: postData.views_count,
        },
      }
      postController
        .updatePost(fakeReq)
        .catch(() => res.status(500).send('error'))

      res.json(postData)
    })
    .catch(err => {
      res.status(500).json({ message: `Произошла ошибка: ${err}` })
    })
}

export const getPosts = (req, res) => {
  postController
    .getPosts(req)
    .then(data => {
      res.json(data.rows)
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' })
    })
}

export const deletePost = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  // get post
  postController
    .getOnePost(req)
    .then(data => {
      const postData = checkPosts(res, data)

      if (req.body.userId !== postData.user_id) {
        return res.status(403).json({ message: 'Нет доступа' })
      }

      // delete post
      postController
        .deletePost(req)
        .then(() => {
          res.send('Успешно удалено.')
        })
        .catch(() => {
          res.status(500).json({ message: 'Произошла ошибка' })
        })
    })
    .catch(err => {
      res.status(500).json({ message: `Произошла ошибка: ${err}` })
    })
}
