import pool from '../db.js'

class PostController {
  CREATE_POST_QUERY =
    'INSERT INTO post (title, text, tags, image_url, views_count, created, user_id) VALUES ($1, $2, $3, $4, 0, NOW(), $5) RETURNING *'
  GET_POSTS_QUERY = 'SELECT * FROM post'
  GET_POST_QUERY = 'SELECT * FROM post WHERE id = $1'
  UPDATE_POST_QUERY =
    'UPDATE post set title = COALESCE($2, title), text = COALESCE($3, text), tags = COALESCE($4, tags), image_url = COALESCE($5, image_url), views_count = COALESCE($6, views_count) WHERE id = $1 RETURNING *'
  DELETE_POST_QUERY = 'DELETE FROM post WHERE id = $1'

  async createPost(req) {
    const { title, text, tags, imageUrl, userId } = req.body
    return await pool.query(this.CREATE_POST_QUERY, [
      title,
      text,
      tags,
      imageUrl,
      userId,
    ])
  }

  async getPosts() {
    return await pool.query(this.GET_POSTS_QUERY)
  }

  async getOnePost(req) {
    const { id } = req.params
    return await pool.query(this.GET_POST_QUERY, [id])
  }

  async updatePost(req) {
    const { id, title, text, tags, imageUrl, viewsCount } = req.body

    if (!id) {
      throw Error()
    }

    return await pool.query(this.UPDATE_POST_QUERY, [
      id,
      title,
      text,
      tags,
      imageUrl,
      viewsCount,
    ])
  }

  async deletePost(req) {
    const { id } = req.params
    return await pool.query(this.DELETE_POST_QUERY, [id])
  }
}

export default new PostController()
