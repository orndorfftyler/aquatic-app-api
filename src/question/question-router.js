const express = require('express')
const questionRouter = express.Router()
const bodyParser = express.json()
const { v4: uuid } = require('uuid')

const QuestionsService = require('./questions-service')
const UsersService = require('../users-service')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')

const { requireAuth } = require('../middleware/jwt-auth')

function processReviews(arrObj) {
  
  let outArr = [];
  for (let i = 0; i < arrObj.length; i++ ){
    let temp = {};
    temp.reviewId = arrObj[i]['review_id'];
    temp.bookId = arrObj[i]['book_id'];
    temp.title = arrObj[i]['title'];
    temp.contents = arrObj[i]['contents'];
    temp.helpCount = arrObj[i]['help_count'];
    temp.user = arrObj[i]['user_id'];
    outArr.push(temp);
  }
  return outArr;
}

questionRouter
  .route('/users/')
  .post(jsonParser, (req, res, next) => {
    const { password, user_name} = req.body

    for (const field of ['user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })


    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username: user_name,
              pw: hashedPassword
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

questionRouter
  .route('/users/:username')
  .all(requireAuth)
  .get((req, res, next) => {
    QuestionsService.getUserId(
      req.app.get('db'),
      req.params.username
    )
      
      .then(userId => {
        res.json(userId)
      })
      
      .catch(next)
  })

questionRouter
  //.route('/reviewsperbook/:book_id')
  .route('/answersperquestion/:question_id')

  .all(requireAuth)
  .get((req, res, next) => {
    QuestionsService.getAllAnswersPerQuestion(
      req.app.get('db'),
      req.params.question_id
    )
      
      .then(answers => {
        //let procRev = processReviews(reviews);
        res.json(answers)
      })
      
      .catch(next)
  })
    
  .post(jsonParser, (req, res, next) => {
    let { answer_id, question_id, title, contents, user_id, username } = req.body
    //let newRev = { reviewId, bookId, title, contents, helpCount, user }
    let newRev = { answer_id, question_id, title, contents, user_id, username }
    
    for (const [key, value] of Object.entries(newRev)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
/*
    newRev.review_id = newRev.reviewId;
    newRev.book_id = newRev.bookId;
    newRev.help_count = newRev.helpCount;
    delete newRev.reviewId;
    delete newRev.bookId;
    delete newRev.helpCount;
*/
    QuestionsService.insertAnswer(
      req.app.get('db'),
      newRev
    )
    .then(answer => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl/*, `/${review.book_id}`*/))
        .json(answer)
    })
  .catch(next)
  })

questionRouter
  //.route('/reviews/:review_id')
  .route('/answers/:answer_id')
  .all(requireAuth)
  .all((req, res, next) => {
    QuestionsService.getAnswerById(
      req.app.get('db'),
      req.params.answer_id
    )
      .then(answer => {
        if (!answer) {
          return res.status(404).json({
            error: { message: `answer doesn't exist` }
          })
        }
        res.answer = answer 
        next() 
      })
      .catch(next)
  })
  /*
  .get((req, res, next) => {
    res.json({
      reviewId: res.review.review_id,
      bookId: xss(res.review.book_id), 
      title: res.review.title,
      contents: res.review.contents,
      helpCount: xss(res.review.help_count),
      user: res.review.user_id
    })

  })
  */
  .delete((req, res, next) => {
    QuestionsService.deleteAnswer(
      req.app.get('db'),
      req.params.answer_id
    )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)  
  })
  .patch(jsonParser, (req, res, next) => {
    let { answer_id, question_id, title, contents, user_id, username } = req.body
    //let updateRev = { reviewId, bookId, title, contents, helpCount }
    let updateAns = { answer_id, question_id, title, contents, user_id, username }

    const numberOfValues = Object.values(updateAns).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain answer_id, question_id, title, contents, user_id, username`
        }
      })
    }
/*
    updateRev.review_id = updateRev.reviewId;
    updateRev.book_id = updateRev.bookId;
    updateRev.help_count = updateRev.helpCount;
    delete updateRev.reviewId;
    delete updateRev.bookId;
    delete updateRev.helpCount;
    */
    QuestionsService.updateAnswer(
      req.app.get('db'),
      updateAns
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  questionRouter
  //.route('/reviewsperbook/:book_id')
  .route('/questionsperuser/:user_id')

  .all(requireAuth)
  .get((req, res, next) => {
    QuestionsService.getAllQuestionsPerUser(
      req.app.get('db'),
      req.params.user_id
    )
      
      .then(answers => {
        //let procRev = processReviews(reviews);
        res.json(answers)
      })
      
      .catch(next)
  })

  questionRouter
  //.route('/reviewsperbook/:book_id')
  .route('/questions/')

  .all(requireAuth)
  .get((req, res, next) => {
    let termArr = req.body

    QuestionsService.searchByTerm(
      req.app.get('db'),
      termArr
    )
      
      .then(answers => {
        //let procRev = processReviews(reviews);
        res.json(answers)
      })
      
      .catch(next)
  })





module.exports = questionRouter