import postController from '../controller/post.controller.js'

export const createPost = async (req, res) => {
  postController.createPost(req).then(data => {
    res.json(data.rows[0])
  }).catch(() => {
    res.status(500).json({ message: 'Произошла ошибка' })
  })
}

export const updatePost = (req, res) => {
  postController.updatePost(req).then(data => {
    res.json(data.rows[0])
  }).catch(() => {
    res.status(500).json({ message: 'Произошла ошибка' })
  })
}

export const getOnePost = (req, res) => {
  postController.getOnePost(req).then(data => {
    const postData = data.rows
    if (postData.length === 0) {
      return res.status(404).json({ message: 'Ничего не найдено' })
    }

    res.json(data.rows[0])
    
  }).catch(() => {
    res.status(500).json({ message: 'Произошла ошибка' })
  })
}

export const getPosts = (req, res) => {
  postController.getPosts(req).then(data => {
    res.json(data.rows)
  }).catch(() => {
    res.status(500).json({ message: 'Произошла ошибка' })
  })
}

export const deletePost = (req, res) => {
  postController.deletePost(req).then(data => {
    res.send('Успешно удалено.')
  }).catch(() => {
    res.status(500).json({ message: 'Произошла ошибка' })
  })
}
