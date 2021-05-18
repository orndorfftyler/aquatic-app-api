const express = require('express')
const questionRouter = express.Router()
const QuestionsService = require('./questions-service')
const UsersService = require('../users-service')
const jsonParser = express.json()
const path = require('path')

const { requireAuth } = require('../middleware/jwt-auth')

// -------------------------------------------- User endpoints

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

  // -------------------------------------------- Answer endpoints


questionRouter
  .route('/answersperquestion/:question_id')

  .get((req, res, next) => {
    QuestionsService.getAllAnswersPerQuestion(
      req.app.get('db'),
      req.params.question_id
    )
      
      .then(answers => {
        res.json(answers)
      })
      
      .catch(next)
  })
    

questionRouter
  .route('/answers/:answer_id')
  .all(requireAuth)
  .post(jsonParser, (req, res, next) => {
    let { answer_id, question_id, title, contents, user_id, username } = req.body
    let newAns = { answer_id, question_id, title, contents, user_id, username }
    
    for (const [key, value] of Object.entries(newAns)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    QuestionsService.insertAnswer(
      req.app.get('db'),
      newAns
    )
    .then(answer => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl))
        .json(answer)
    })
  .catch(next)
  })

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
    let updateAns = { answer_id, question_id, title, contents, user_id, username }

    const numberOfValues = Object.values(updateAns).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain answer_id, question_id, title, contents, user_id, username`
        }
      })
    }
    QuestionsService.updateAnswer(
      req.app.get('db'),
      updateAns
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })


// -------------------------------------------- Question endpoints

  questionRouter
  .route('/questionsperuser/:user_id')

  .all(requireAuth)
  .get((req, res, next) => {
    QuestionsService.getAllQuestionsPerUser(
      req.app.get('db'),
      req.params.user_id
    )
      
      .then(answers => {
        res.json(answers)
      })
      
      .catch(next)
  })

  questionRouter
  .route('/questionsearch/:search_term')

  .get((req, res, next) => {

    QuestionsService.searchByTerm(
      req.app.get('db'),
      req.params.search_term
    )
      
      .then(questions => {
        res.json(questions)
      })
      
      .catch(next)
  })

  questionRouter
  .route('/questions/')

  .all(requireAuth)
  .post(jsonParser, (req, res, next) => {
    let { question_id, title, contents, user_id, username } = req.body
    let newQue = { question_id, title, contents, user_id, username }
    
    for (const [key, value] of Object.entries(newQue)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    QuestionsService.insertQuestion(
      req.app.get('db'),
      newQue
    )
    .then(answer => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl))
        .json(answer)
    })
  .catch(next)
  })

  questionRouter
  .route('/questions/:question_id')
  .get((req, res, next) => {

    QuestionsService.getQuestionById(
      req.app.get('db'),
      req.params.question_id
    )
      
      .then(question => {
        res.json(question)
      })
      
      .catch(next)
  })

  .all(requireAuth)
  .all((req, res, next) => {
    QuestionsService.getQuestionById(
      req.app.get('db'),
      req.params.question_id
    )
      .then(answer => {
        if (!answer) {
          return res.status(404).json({
            error: { message: `question doesn't exist` }
          })
        }
        res.answer = answer 
        next() 
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    QuestionsService.deleteQuestion(
      req.app.get('db'),
      req.params.question_id
    )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)  
  })
  .patch(jsonParser, (req, res, next) => {
    let { question_id, title, contents, user_id, username } = req.body
    let updateQue = { question_id, title, contents, user_id, username }

    const numberOfValues = Object.values(updateQue).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain answer_id, question_id, title, contents, user_id, username`
        }
      })
    }
    QuestionsService.updateQuestion(
      req.app.get('db'),
      updateQue
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = questionRouter