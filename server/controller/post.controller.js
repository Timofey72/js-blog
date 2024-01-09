import pool from '../db.js';

class PostController {
  CREATE_POST_QUERY = `
    INSERT INTO post (title, text, tags, image_url, views_count, created, user_id)
    VALUES ($1, $2, $3, $4, 0, NOW(), $5)
    RETURNING *
  `;
  GET_POSTS_QUERY = `
    SELECT post.*, person.name AS user_name, person.surname AS user_surname, person.avatar_url AS user_avatar
    FROM post
    JOIN person ON person.id = post.user_id
    ORDER BY post.created DESC
  `;
  GET_POST_QUERY = `
    UPDATE post
    SET views_count = views_count + 1
    FROM person
    WHERE post.id = $1 AND post.user_id = person.id
    RETURNING post.*, person.id AS user_id, person.name AS user_name, person.surname AS user_surname, person.created AS user_created, person.updated AS user_updated;
  `;
  UPDATE_POST_QUERY = `
    UPDATE post
    SET title = COALESCE($2, title), text = COALESCE($3, text), tags = COALESCE($4, tags),
        image_url = COALESCE($5, image_url), views_count = COALESCE($6, views_count)
    WHERE id = $1
    RETURNING *
  `;
  DELETE_POST_QUERY = 'DELETE FROM post WHERE id = $1';

  async createPost(req) {
    const { title, text, tags, imageUrl, userId } = req.body;
    return await pool.query(this.CREATE_POST_QUERY, [title, text, tags, imageUrl, userId]);
  }

  async getPosts() {
    return await pool.query(this.GET_POSTS_QUERY);
  }

  async getOnePost(req) {
    const id = req.params.id || req.body.id;
    return await pool.query(this.GET_POST_QUERY, [id]);
  }

  async updatePost(req) {
    const { id, title, text, tags, imageUrl, viewsCount } = req.body;

    if (!id) {
      throw Error();
    }

    return await pool.query(this.UPDATE_POST_QUERY, [id, title, text, tags, imageUrl, viewsCount]);
  }

  async deletePost(req) {
    const { id } = req.params;
    return await pool.query(this.DELETE_POST_QUERY, [id]);
  }
}

export default new PostController();
