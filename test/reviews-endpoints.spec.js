const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures');
const helpers = require('./reviews.fixtures')

describe('Review and User Endpoints', function() {

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
    await db.raw('TRUNCATE users, reviews RESTART IDENTITY CASCADE');
  });

  afterEach(async () => {
    await db.raw('TRUNCATE users, reviews RESTART IDENTITY CASCADE');
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

  describe(`GET /reviewsperbook/:book_id`, () => {
    
    context(`Given no reviews for that book`, () => {
      const testUsers = makeUsersArray()
      const testReviews = helpers.makeReviewsArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })
      beforeEach('insert reviews', () => {
        return db
          .into('reviews')
          .insert(testReviews)
      })

        it(`responds with 200 and an empty list`, () => {
          const testUsers = makeUsersArray()
                
          return supertest(app)
              .get('/api/reviewsperbook/f2801f1b9fd19000')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))

              .expect(200, [])
        })
    })
      
    context('Given there are reviews for a certain book', () => {
      const testUsers = makeUsersArray()
      const testReviews = helpers.makeReviewsArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })
      beforeEach('insert reviews', () => {
        return db
          .into('reviews')
          .insert(testReviews)
      })

      it('responds with 200 and reviews for the given book', () => {
        const expectedReview = testReviews[0]
        return supertest(app)
          .get(`/api/reviewsperbook/f2801f1b9fd1`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(res => {
            expect(res.body[0]['reviewId']).to.eql(expectedReview.review_id)
            expect(res.body[0]['bookId']).to.eql(expectedReview.book_id)
            expect(res.body[0]['title']).to.eql(expectedReview.title)
            expect(res.body[0]['contents']).to.eql(expectedReview.contents)
            expect(res.body[0]['helpCount']).to.eql(expectedReview.help_count)
            expect(res.body[0]['user']).to.eql(expectedReview.user_id)

          })
      })
    })
  }) 
  
  describe(`POST /reviewsperbook/:book_id`, () => {
    context('Given there are reviews for a certain book', () => {
      const testUsers = makeUsersArray()
      const testReviews = helpers.makeReviewsArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })
      beforeEach('insert reviews', () => {
        return db
          .into('reviews')
          .insert(testReviews)
      })

      it(`creates a review, responding with 201 and the new review`,  function() {
        this.retries(3)
        const newReview = {
          reviewId: 'a92d778b-7e15-4aed-b53c-09c32e875b6c',
          bookId: 'f2787f1b9fd1',
          title: 'POST test title',
          contents: 'review to post',
          helpCount: 3,
          user: 'Squirtle'
        }
        return supertest(app)
          .post('/api/reviewsperbook/f2787f1b9fd1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .set('content-type', 'application/json')
          .send(newReview)

          .expect(201)
          .expect(res => {
            expect(res.body.review_id).to.eql(newReview.reviewId)
            expect(res.body.book_id).to.eql(newReview.bookId)
            expect(res.body.title).to.eql(newReview.title)
            expect(res.body.contents).to.eql(newReview.contents)
            expect(res.body.help_count).to.eql(newReview.helpCount)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/reviewsperbook/${res.body.book_id}`)
          })
          .then(postRes =>
            supertest(app)
              .get(`/api/reviewsperbook/${postRes.body.book_id}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(postPostRes => {
                expect(postPostRes.body.reviewId).to.eql(postRes.review_id)
                expect(postPostRes.body.bookId).to.eql(postRes.book_id)
                expect(postPostRes.body.title).to.eql(postRes.title)
                expect(postPostRes.body.contents).to.eql(postRes.contents)
                expect(postPostRes.body.helpCount).to.eql(postRes.help_count)
                
              })
          )
        
      })
    })  
  }) 

  describe(`DELETE /api/reviews/:reviewId`, () => {
    context('Given the review exists', () => {
      const testUsers = makeUsersArray()
      const testReviews = helpers.makeReviewsArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })
      beforeEach('insert reviews', () => {
        return db
          .into('reviews')
          .insert(testReviews)
      })


      it('responds with 204 and removes the review', () => {
        const idToRemove = 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1'
        const expectedReviews = [];//testReviews.filter(review => review.review_id !== idToRemove)
        return supertest(app)
          .delete(`/api/reviews/${idToRemove}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/reviewsperbook/f2801f1b9fd1`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(expectedReviews)
          )
      })
    })
  }) 

  describe(`PATCH /api/reviews/:reviewId`, () => {
    context('Given the review exists', () => {
      const testUsers = makeUsersArray()
      const testReviews = helpers.makeReviewsArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })
      beforeEach('insert reviews', () => {
        return db
          .into('reviews')
          .insert(testReviews)
      })

      it('responds with 204 and updates the review', () => {
        const idToUpdate = 'b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1'
        const updateReview = {
          reviewId: 'b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1',
          bookId: 'f2301f1b9fd1',
          title: 'Patch Harry Potter',
          contents: 'patch test',
          helpCount: 2

        }
        return supertest(app)
          .patch(`/api/reviews/${idToUpdate}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(updateReview)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/reviews/${idToUpdate}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(res => {
                expect(res.body.reviewId).to.eql(updateReview.reviewId)
                expect(res.body.bookId).to.eql(updateReview.bookId)
                expect(res.body.reviewId).to.eql(updateReview.reviewId)
                expect(res.body.contents).to.eql(updateReview.contents)
                expect(parseInt(res.body.helpCount)).to.eql(updateReview.helpCount)
              })
          )
      })

    })
  })

  describe(`GET /api/helpfulreview/:review_id`, () => {
    context('Given there is helpful feedback for a certain review', () => {
    const testUsers = makeUsersArray()
    const testReviews = helpers.makeReviewsArray()
    const testHelpfuls = helpers.makeHelpfulsArray()

    beforeEach('insert users', () => {
      return db
        .into('users')
        .insert(testUsers)
    })
    beforeEach('insert reviews', () => {
      return db
        .into('reviews')
        .insert(testReviews)
    })
    beforeEach('insert reviews', () => {
      return db
        .into('helpful')
        .insert(testHelpfuls)
    })

    it('responds with helpful data for given review', () => {
      const expectedReview = testHelpfuls[0]
      return supertest(app)
        .get(`/api/helpfulreview/b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(res => {
          expect(res.body[0]['id']).to.eql(expectedReview.id)
          expect(res.body[0]['user_id']).to.eql(expectedReview.user_id)
          expect(res.body[0]['review_id']).to.eql(expectedReview.review_id)
          expect(res.body[0]['book_id']).to.eql(expectedReview.book_id)

        })
    })
  })
}) 

  describe(`POST /api/helpfulreview/:review_id`, () => {
    context('Given there are reviews for a certain book', () => {
      const testUsers = makeUsersArray()
      const testReviews = helpers.makeReviewsArray()
      const testHelpfuls = helpers.makeHelpfulsArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })
      beforeEach('insert reviews', () => {
        return db
          .into('reviews')
          .insert(testReviews)
      })
      beforeEach('insert reviews', () => {
        return db
          .into('helpful')
          .insert(testHelpfuls)
      })

      it(`creates a review helpful feedback, responding with 201 and the new helpful data`,  function() {
        this.retries(3)
        const newHelpful = {
          id: 1,
          user_id: 3,
          review_id: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1',
          book_id: 'f2801f1b9fd1'
        }

        return supertest(app)
          .post(`/api/helpfulreview/b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .set('content-type', 'application/json')
          .send(newHelpful)

          .expect(201)
          .expect(res => {
            expect(res.body['id']).to.eql(newHelpful.id)
            expect(res.body['user_id']).to.eql(newHelpful.user_id)
            expect(res.body['review_id']).to.eql(newHelpful.review_id)
            expect(res.body['book_id']).to.eql(newHelpful.book_id)
          })
        
      })
    })  
  }) 
  
})
