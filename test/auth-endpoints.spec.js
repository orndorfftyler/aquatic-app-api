const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures');
const helpers = require('./questions-answers.fixtures')

describe('Auth Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  beforeEach(async () => {
    await db.raw('TRUNCATE users, answers RESTART IDENTITY CASCADE');
  });

  afterEach(async () => {
    await db.raw('TRUNCATE users, answers RESTART IDENTITY CASCADE');
  });

  describe(`POST /api/auth/login`, () => {

    const testUsers = makeUsersArray()
    const testAnswers = helpers.makeAnswersArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    beforeEach('insert answers', () => {
      return db
        .into('answers')
        .insert(testAnswers)
    })

    const testUser = {
      id: 3,
      username: 'Squirtle',
      pw: 'sss'

    };

    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUser.username,
        password: testUser.pw,
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
      const userInvalidUser = { user_name: 'user-not', password: 'existy' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect user_name or password` })
    })

    it(`responds 400 'invalid user_name or password' when bad password`, () => {
      const userInvalidPass = { user_name: testUser.username, password: 'incorrect' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPass)
        .expect(400, { error: `Incorrect user_name or password` })
    })

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        user_name: testUser.username,
        password: testUser.pw,
      }
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: 'HS256',
        }
      )
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        })
    })
  })
})
