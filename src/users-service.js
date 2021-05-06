const bcrypt = require('bcryptjs')
const xss = require('xss')

const UsersService = {
  hasUserWithUserName(knex, user_name) {
    return knex.from('users')
      .where('username', user_name)
      .first()
      .then(user => !!user)
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.username)
    }
  },
}

module.exports = UsersService
