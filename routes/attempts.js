const express = require('express');
const router = express.Router();

module.exports = (db) => {

// viewing results from the quiz

  router.get("/:quiz_attempt_id/results", (req, res) => {
    let string = `
    SELECT answer_attempts.id, answer, question, isCorrect, quiz_attempt_id, answer_attempts.user_id, quizzes.name
    FROM quiz_attempts
    JOIN answer_attempts ON quiz_attempts.id = quiz_attempt_id
    JOIN answers ON (answer_id = answers.id)
    JOIN quizzes ON (quiz_attempts.quiz_id = quizzes.id)
    JOIN questions ON (questions.id = answer_attempts.question_id)
    WHERE quiz_attempts.id = $1
    ORDER BY id;
    `;
    db.query(string, [req.params.quiz_attempt_id])
    .then(data => {
      let templateVar = {attempt: data.rows}
      res.render("../views/results", templateVar);
    })
  })

  // page for completed quiz once all questions have been added

  router.get("/:quiz_id/:user_id", (req, res) => {
    db.query(`
    SELECT user_id, question_id, quizzes.name, questions.question, answers.answer, quiz_id, answers.isCorrect, answers.id
    FROM answers
    JOIN questions ON questions.id = answers.question_id
    JOIN quizzes ON quizzes.id = questions.quiz_id
    JOIN users ON user_id = users.id
    WHERE quiz_id = $1
    GROUP BY user_id, question_id, quizzes.name, questions.question, answers.answer, quiz_id, answers.isCorrect, questions.id, answers.id
    ORDER BY questions.id;`, [req.params.quiz_id])
      .then(data => {
        let templateVar = { input: data.rows }
        res.render('../views/finishedQuiz', templateVar)
      });
  });


  //inserting the quiz attempt and answer attempt data into the database

  router.post("/:quiz_id/results/:user_id", (req, res) => {
    req.session = req.body;
    db.query(`
    INSERT INTO quiz_attempts (quiz_id, user_id) VALUES ($1, $2) RETURNING *;
    `, [req.params.quiz_id, req.params.user_id])
      .then((data) => {
        let questionIds = Object.keys(req.body);
        let string = `INSERT INTO answer_attempts (answer_id, user_id, quiz_attempt_id, question_id) VALUES `;
        for (let questionId of questionIds) {
          if (questionIds.indexOf(questionId) === (questionIds.length - 1)) {
            string += `(${req.body[questionId]}, ${req.params.user_id}, ${data.rows[0].id}, ${questionId}) RETURNING *;`
          } else {
            string += `(${req.body[questionId]}, ${req.params.user_id}, ${data.rows[0].id}, ${questionId}), `;
          }
        }
        db.query(string)
        return data.rows[0].id;
      })
      .then(id => {
        res.redirect(`/attempts/${id}/results`)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })

  return router;
};
