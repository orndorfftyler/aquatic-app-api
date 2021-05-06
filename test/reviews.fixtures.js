const jwt = require('jsonwebtoken')

function makeReviewsArray() {
    return [
        {
          id: 2,
          user_id: 1,
          review_id: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1',
          book_id: 'f2801f1b9fd1',
          title: 'Dracula was good',
          contents: 'Corporis accusamus placeat quas non voluptas.',
          help_count: 2
        },
        {
          id: 3,
          user_id: 2,
          review_id: 'b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1',
          book_id: 'f2301f1b9fd1',
          title: 'Harry Potter was ok',
          contents: 'Eos laudantium quia ab',
          help_count: 3
        },
        {
          id: 4,
          user_id: 3,
          review_id: 'b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1',
          book_id: 'f2401f1b9fd1',
          title: 'Mixology was delicious',
          contents: 'Occaecati dignissi',
          help_count: 4
        }
      ];
  }
    
  function makeHelpfulsArray() {
    return [
        {
          id: 2,
          user_id: 2,
          review_id: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1',
          book_id: 'f2801f1b9fd1'
        },
        {
          id: 3,
          user_id: 3,
          review_id: 'b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1',
          book_id: 'f2301f1b9fd1'
        },
        {
          id: 4,
          user_id: 1,
          review_id: 'b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1',
          book_id: 'f2401f1b9fd1'
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
    makeReviewsArray,
    makeAuthHeader,
    makeHelpfulsArray
  }