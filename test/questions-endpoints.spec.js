const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures');
const helpers = require('./questions-answers.fixtures')

describe('Answer and User Endpoints', function() {

  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => {db.destroy(); this.timeout(10000);})

  beforeEach(async () => {
    await db.raw('TRUNCATE users, answers, questions RESTART IDENTITY CASCADE');
  });

  afterEach(async () => {
    await db.raw('TRUNCATE users, answers, questions RESTART IDENTITY CASCADE');
  });

  describe(`GET /users/:username`, () => {
    context('Given user exists', () => {
      const testUsers = makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it('responds with 200 and id for the given user', () => {
        const expectedUserId = {
          id: 2
        }
        return supertest(app)
          .get(`/api/users/Pikachu`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
          .expect(200)
          .expect(res => {
            expect(res.body.id).to.eql(expectedUserId.id)
          })
      })

      
    })
  })

  describe(`GET /answersperquestion/:question_id`, () => {
    
    context(`Given no answers for that question`, () => {
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

        it(`responds with 200 and an empty list`, () => {
          //const testUsers = makeUsersArray()
                
          return supertest(app)
              .get('/api/answersperquestion/1a88da27-7b60-49a1-9393-829785e0a28d')
              //.set('Authorization', helpers.makeAuthHeader(testUsers[0]))

              .expect(200, [])
        })
    })
      
    context('Given there are answers for a certain question', () => {
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

      it('responds with 200 and answers for the given question', () => {
        const expectedAnswer = testAnswers[0]
        return supertest(app)
          .get(`/api/answersperquestion/9d440833-2834-4b18-a7c3-adfa743397bb`)
          //.set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(res => {
            expect(res.body[0]['id']).to.eql(expectedAnswer.id)
            expect(res.body[0]['answer_id']).to.eql(expectedAnswer.answer_id)
            expect(res.body[0]['question_id']).to.eql(expectedAnswer.question_id)
            expect(res.body[0]['title']).to.eql(expectedAnswer.title)
            expect(res.body[0]['contents']).to.eql(expectedAnswer.contents)
            expect(res.body[0]['user_id']).to.eql(expectedAnswer.user_id)
            expect(res.body[0]['username']).to.eql(expectedAnswer.username)
          })
      })
    })
  }) 
  
  describe(`POST /answers/:answer_id`, () => {
    context('Given there are answers for a certain question', () => {
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

      it(`creates an answer, responding with 201 and the new answer`,  function() {
        this.retries(3)
        const newAnswer = {
          answer_id: '4863bf54-9a1a-4249-831b-1c67f30a445c',
          question_id: '9d440833-2834-4b18-a7c3-adfa743397bb',
          title: 'frogs LOVE ice cream',
          contents: 'answer to post',
          user_id: 1,
          username: 'Bulbasaur'
        }
        return supertest(app)
          .post('/api/answers/4863bf54-9a1a-4249-831b-1c67f30a445c')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .set('content-type', 'application/json')
          .send(newAnswer)

          .expect(201)
          .expect(res => {
            expect(res.body.answer_id).to.eql(newAnswer.answer_id)
            expect(res.body.question_id).to.eql(newAnswer.question_id)
            expect(res.body.title).to.eql(newAnswer.title)
            expect(res.body.contents).to.eql(newAnswer.contents)
            expect(res.body.user_id).to.eql(newAnswer.user_id)
            expect(res.body.username).to.eql(newAnswer.username)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/answers/${res.body.answer_id}`)
          })
          .then(postRes =>
            supertest(app)
              .get(`/api/answersperquestion/${postRes.body.question_id}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(postPostRes => {
                expect(postPostRes.body.answer_id).to.eql(postRes.answer_id)
                expect(postPostRes.body.question_id).to.eql(postRes.question_id)
                expect(postPostRes.body.title).to.eql(postRes.title)
                expect(postPostRes.body.contents).to.eql(postRes.contents)
                expect(postPostRes.body.user_id).to.eql(postRes.user_id)
                expect(postPostRes.body.username).to.eql(postRes.username)
              })
          )
        
      })
    })  
  }) 

  describe(`DELETE /api/answers/:answer_id`, () => {
    context('Given the answer exists', () => {
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


      it('responds with 204 and removes the answer', () => {
        const idToRemove = '7eac834c-a6df-496b-8104-6a813e2e3122'
        const expectedAnswers = [];//testAnswers.filter(answer => answer.answer_id !== idToRemove)
        return supertest(app)
          .delete(`/api/answers/${idToRemove}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/answersperquestion/898176a5-26af-4a2a-9e1a-e91472cdce8d`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(expectedAnswers)
          )
      })
    })
  }) 

  describe(`PATCH /api/answers/:answer_id`, () => {
    context('Given the answer exists', () => {
      const testUsers = makeUsersArray()
      const testAnswers = helpers.makeAnswersArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })
      beforeEach('insert answer', () => {
        return db
          .into('answers')
          .insert(testAnswers)
      })

      it('responds with 204 and updates the answer', () => {
        const idToUpdate = '7eac834c-a6df-496b-8104-6a813e2e3122'
        const updateAnswer = {
          answer_id: '7eac834c-a6df-496b-8104-6a813e2e3122',
          question_id: '898176a5-26af-4a2a-9e1a-e91472cdce8d',
          title: 'Patch goldfish',
          contents: 'patch test',
          user_id: '1',
          username: 'Bulbasaur'

        }
        return supertest(app)
          .patch(`/api/answers/${idToUpdate}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .set('content-type', 'application/json')

          .send(updateAnswer)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/answersperquestion/898176a5-26af-4a2a-9e1a-e91472cdce8d`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(ress => {
                expect(ress.body[0].answer_id).to.eql(updateAnswer.answer_id)
                expect(ress.body[0].question_id).to.eql(updateAnswer.question_id)
                expect(ress.body[0].title).to.eql(updateAnswer.title)
                expect(ress.body[0].contents).to.eql(updateAnswer.contents)
              })
          )
      })

    })
  })
//--------------------------------------------------- test for question endpoints 

describe(`GET /questionsperuser/:user_id`, () => {
    
  context(`Given no questions for that user`, () => {
    const testUsers = makeUsersArray()
    const testQuestions = helpers.makeQuestionsArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    
    beforeEach('insert questions', () => {
      return db
        .into('questions')
        .insert(testQuestions)
    })

      it(`responds with 200 and an empty list`, () => {
        const testUsers = makeUsersArray()
              
        return supertest(app)
            .get('/api/answersperquestion/1a88da27-7b60-49a1-9393-829785e0a28d')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))

            .expect(200, [])
      })
  })
    
  context('Given there are questions for a certain user', () => {
    const testUsers = makeUsersArray()
    const testQuestions = helpers.makeQuestionsArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    
    beforeEach('insert questions', () => {
      return db
        .into('questions')
        .insert(testQuestions)
    })

    it('responds with 200 and questions for the given user', () => {
      const expectedQuestion = testQuestions[0]
      return supertest(app)
        .get(`/api/questionsperuser/1`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(res => {
          expect(res.body[0]['id']).to.eql(expectedQuestion.id)
          expect(res.body[0]['answer_id']).to.eql(expectedQuestion.answer_id)
          expect(res.body[0]['question_id']).to.eql(expectedQuestion.question_id)
          expect(res.body[0]['title']).to.eql(expectedQuestion.title)
          expect(res.body[0]['contents']).to.eql(expectedQuestion.contents)
          expect(res.body[0]['user_id']).to.eql(expectedQuestion.user_id)
          expect(res.body[0]['username']).to.eql(expectedQuestion.username)
        })
    })
  })
}) 

describe(`GET /questionsearch/:search_terms`, () => {
    
  context(`Given no question results for that search term`, () => {
    const testUsers = makeUsersArray()
    const testQuestions = helpers.makeQuestionsArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    
    beforeEach('insert questions', () => {
      return db
        .into('questions')
        .insert(testQuestions)
    })

      it(`responds with 200 and an empty list`, () => {
        //const testUsers = makeUsersArray()
              
        return supertest(app)
            .get('/api/questionsearch/dragons')
            //.set('Authorization', helpers.makeAuthHeader(testUsers[0]))

            .expect(200, [])
      })
  })
    
  context('Given there are question results for a certain search term', () => {
    const testUsers = makeUsersArray()
    const testQuestions = helpers.makeQuestionsArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    
    beforeEach('insert questions', () => {
      return db
        .into('questions')
        .insert(testQuestions)
    })

    it('responds with 200 and questions for the given user', () => {
      const expectedQuestion = testQuestions[0]
      return supertest(app)
        .get(`/api/questionsearch/turtles`)
        //.set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(res => {
          expect(res.body[0]['id']).to.eql(expectedQuestion.id)
          expect(res.body[0]['answer_id']).to.eql(expectedQuestion.answer_id)
          expect(res.body[0]['question_id']).to.eql(expectedQuestion.question_id)
          expect(res.body[0]['title']).to.eql(expectedQuestion.title)
          expect(res.body[0]['contents']).to.eql(expectedQuestion.contents)
          expect(res.body[0]['user_id']).to.eql(expectedQuestion.user_id)
          expect(res.body[0]['username']).to.eql(expectedQuestion.username)
        })
    })
  })
}) 

describe(`POST /questions/`, () => {
  context('Given there are questions', () => {
    const testUsers = makeUsersArray()
    const testQuestions = helpers.makeQuestionsArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    beforeEach('insert questions', () => {
      return db
        .into('questions')
        .insert(testQuestions)
    })

    it(`creates an question, responding with 201 and the new question`,  function() {
      this.retries(3)
      const newQuestion = {
        question_id: '451742ab-5d20-4c57-b13f-99eef28f06e6',
        title: 'Can you grow sea urchins in a tank?',
        contents: 'more details',
        user_id: 1,
        username: 'Bulbasaur'
      }
      return supertest(app)
        .post('/api/questions/')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .set('content-type', 'application/json')
        .send(newQuestion)

        .expect(201)
        .expect(res => {
          expect(res.body.question_id).to.eql(newQuestion.question_id)
          expect(res.body.title).to.eql(newQuestion.title)
          expect(res.body.contents).to.eql(newQuestion.contents)
          expect(res.body.user_id).to.eql(newQuestion.user_id)
          expect(res.body.username).to.eql(newQuestion.username)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/questions/`)
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/questionsearch/urchin`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(postPostRes => {
              expect(postPostRes.body.question_id).to.eql(postRes.question_id)
              expect(postPostRes.body.title).to.eql(postRes.title)
              expect(postPostRes.body.contents).to.eql(postRes.contents)
              expect(postPostRes.body.user_id).to.eql(postRes.user_id)
              expect(postPostRes.body.username).to.eql(postRes.username)
            })
        )
      
    })
  })  
}) 

describe(`PATCH /api/questions/:question_id`, () => {
  context('Given the question exists', () => {
    const testUsers = makeUsersArray()
    const testQuestions = helpers.makeQuestionsArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    beforeEach('insert question', () => {
      return db
        .into('questions')
        .insert(testQuestions)
    })

    it('responds with 204 and updates the question', () => {
      const idToUpdate = '898176a5-26af-4a2a-9e1a-e91472cdce8d'
      const updateQuestion = {
        question_id: '898176a5-26af-4a2a-9e1a-e91472cdce8d',
        title: 'Patch goldfish',
        contents: 'patch test',
        user_id: '1',
        username: 'Bulbasaur'

      }
      return supertest(app)
        .patch(`/api/questions/${idToUpdate}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .set('content-type', 'application/json')

        .send(updateQuestion)
        .expect(204)
        .then(res =>
          supertest(app)
            .get(`/api/questionsearch/goldfish`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(ress => {
              expect(ress.body[0].answer_id).to.eql(updateQuestion.answer_id)
              expect(ress.body[0].question_id).to.eql(updateQuestion.question_id)
              expect(ress.body[0].title).to.eql(updateQuestion.title)
              expect(ress.body[0].contents).to.eql(updateQuestion.contents)
            })
        )
    })

  })
})

describe(`DELETE /api/questions/:answer_id`, () => {
  context('Given the question exists', () => {
    const testUsers = makeUsersArray()
    const testQuestions = helpers.makeQuestionsArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    beforeEach('insert questions', () => {
      return db
        .into('questions')
        .insert(testQuestions)
    })


    it('responds with 204 and removes the question', () => {
      const idToRemove = '9d440833-2834-4b18-a7c3-adfa743397bb'
      const expectedQuestions = [];//testAnswers.filter(answer => answer.answer_id !== idToRemove)
      return supertest(app)
        .delete(`/api/questions/${idToRemove}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(204)
        .then(res =>
          supertest(app)
            .get(`/api/questionsearch/turtles`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(expectedQuestions)
        )
    })
  })
}) 


  
})
