import pool from '../db.js'

class UserController {
  CREATE_USER_QUERY =
    'INSERT INTO person (name, surname, email, avatar_url, password_hash, created, updated) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, name, surname, email, avatar_url, created'
  GET_USERS_QUERY = 'SELECT * FROM person'
  GET_USER_QUERY = 'SELECT * FROM person WHERE id = $1 OR email = $2'
  UPDATE_USER_QUERY =
    'UPDATE person set name = COALESCE($2, name), surname = COALESCE($3, surname), email = COALESCE($4, email), avatar_url = COALESCE($5, avatar_url), password_hash = COALESCE($6, password_hash), updated = NOW() WHERE id = $1 RETURNING *'
  DELETE_USER_QUERY = 'DELETE FROM person WHERE id = $1'

  async createUser(req, passwordHash) {
    const { name, surname, email, avatar_url } = req.body
    return await pool.query(this.CREATE_USER_QUERY, [
      name,
      surname,
      email,
      avatar_url,
      passwordHash,
    ])
  }

  async getUsers(req, res) {
    const users = await pool.query(this.GET_USERS_QUERY)
    res.json(users.rows)
  }

  async getOneUser(req, login = false) {
    const { id, email } = req.body
    if (login && !email) {
      throw Error()
    }
    if (!id && !email) {
      throw Error()
    }
    return await pool.query(this.GET_USER_QUERY, [id, email])
  }

  async updateUser(req, res, passwordHash = null) {
    const { id, name, surname, email, avatar_url } = req.body

    if (!id) {
      return res
        .status(400)
        .json({ error: 'Не указан идентификатор пользователя' })
    }

    pool
      .query(this.UPDATE_USER_QUERY, [
        id,
        name,
        surname,
        email,
        avatar_url,
        passwordHash,
      ])
      .then(data => res.json(data.rows[0]))
      .catch(() =>
        res.status(400).json({ error: 'Не удалось обновить данные' }),
      )
  }

  async deleteUser(req, res) {
    const { id } = req.params
    pool
      .query(this.DELETE_USER_QUERY, [id])
      .then(data => (data.rows[0] ? res.json(data.rows[0]) : res.json({})))
      .catch(() =>
        res.status(400).json({ error: 'Не удалось удалить пользователя' }),
      )
  }
}

export default new UserController()
