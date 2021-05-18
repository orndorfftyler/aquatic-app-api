const jwt = require('jsonwebtoken')

function makeAnswersArray() {
    return [
        {
          id: 2,
          answer_id: 'd3011892-d8ab-470c-b65e-5ec68bcc14b9',
          question_id: '9d440833-2834-4b18-a7c3-adfa743397bb',
          title: 'No, you can not feed turtles ice cream',
          contents: 'Corporis accusamus placeat quas non voluptas.',
          user_id: 2,
          username: 'Pikachu'
        },
        {
          id: 3,
          answer_id: '7eac834c-a6df-496b-8104-6a813e2e3122',
          question_id: '898176a5-26af-4a2a-9e1a-e91472cdce8d',
          title: 'Yes, goldfish are made of gold',
          contents: 'Corporis accusamus placeat quas non voluptas.',
          user_id: 1,
          username: 'Bulbasaur'
        },
        {
          id: 4,
          answer_id: '1484d75b-abb3-4676-9bee-592c1dbb8b0f',
          question_id: 'e325e9f3-375b-4f6e-9f1e-a8819d3bb14b',
          title: 'Too many crabs will turn water orange',
          contents: 'Corporis accusamus placeat quas non voluptas.',
          user_id: 3,
          username: 'Squirtle'
        }
      ];
  }
    
  function makeQuestionsArray() {
    return [
      {
        id: 2,
        question_id: '9d440833-2834-4b18-a7c3-adfa743397bb',
        title: 'Can you feed turtles ice cream',
        contents: 'Corporis accusamus placeat quas non voluptas.',
        user_id: 1,
        username: 'Bulbasaur'
      },
      {
        id: 3,
        question_id: '898176a5-26af-4a2a-9e1a-e91472cdce8d',
        title: 'Are goldfish made of gold',
        contents: 'Corporis accusamus placeat quas non voluptas.',
        user_id: 3,
        username: 'Squirtle'
      },
      {
        id: 4,
        question_id: 'e325e9f3-375b-4f6e-9f1e-a8819d3bb14b',
        title: 'What happens if crabs multiply',
        contents: 'Corporis accusamus placeat quas non voluptas.',
        user_id: 2,
        username: 'Pikachu'
      }
    ];
  }

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.username,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }
  
  module.exports = {
    makeAnswersArray,
    makeAuthHeader,
    makeQuestionsArray
  }