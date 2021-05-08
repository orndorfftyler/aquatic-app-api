const QuestionsService = {
    getAllAnswersPerQuestion(knex, question_id) {
        return knex.from('answers').select('*').where('question_id', question_id);

    },
    insertAnswer(knex, newAns) {
        /*
        let newId = knex.from('users').select('id').where('username', newAns.user).first()//.then(rows => {return rows[0]});
        newAns.user_id = newId;
        delete newAns.user;

        console.log(newId);
        */

        return knex
            .insert(newAns)
            .into('answers')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            
    },
    getAnswerById(knex, answer_id) {
        return knex.from('answers').select('*').where('answer_id', answer_id).first()
    },
    deleteAnswer(knex, answer_id) {
        return knex.from('answers').select('*').where('answer_id', answer_id).delete()
    },
    updateAnswer(knex, newAnswerFields) {
        return knex.from('answers').select('*').where('answer_id', newAnswerFields.answer_id).first().update(newAnswerFields)
    },
    getUserId(knex, username) {
        return knex.from('users').select('id').where('username', username).first()
    },
    getAllQuestionsPerUser(knex, user_id) {
        return knex.from('questions').select('*').where('user_id', user_id);

    },
    searchByTerm(knex, term) {
        return knex.from('questions').select('*').where('contents', 'like', `%${term}%`).orWhere('title', 'like', `%${term}%`);
    },
    insertQuestion(knex, question) {
        return knex
            .insert(question)
            .into('questions')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteQuestion(knex, question_id) {
        return knex.from('questions').select('*').where('question_id', question_id).delete()
    },
    updateQuestion(knex, newQuestionFields) {
        return knex.from('questions').select('*').where('question_id', newQuestionFields.question_id).first().update(newQuestionFields)
    }





};

module.exports = QuestionsService;