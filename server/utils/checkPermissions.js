import postController from '../controller/post.controller.js';

export const isPostExists = (data) => {
  let postData = data.rows;
  if (postData.length === 0) {
    return null;
  }

  return postData[0];
};

export default (req, res, next) => {
  postController
    .getOnePost(req)
    .then((data) => {
      const postData = isPostExists(data);
      if (!postData) {
        return res.status(404).json({ message: 'Ничего не найдено' });
      }

      if (req.body.userId !== postData.user_id) {
        return res.status(403).json({ message: 'Нет доступа' });
      }

      next();
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};
