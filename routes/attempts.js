const express = require('express');
const router = express.Router();

module.exports = (db) => {

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
        console.log(data.rows)
        let templateVar = { input: data.rows}
        res.render('../views/finishedQuiz', templateVar)
      });
  });

  //working!

  router.post("/:quiz_id/:user_id", (req, res) => {
    req.session = req.body;
    console.log(req.body);
    db.query(`
    INSERT INTO quiz_attempts (quiz_id, user_id) VALUES ($1, $2) RETURNING *;
    `, [req.params.quiz_id, req.params.user_id])
    .then(() => {
      let answerId = Object.values(req.body);
      console.log(answerId);
      let string = `
      INSERT INTO answer_attempts (answer_id, user_id) VALUES ($1, $2) RETURNING *
      `;

      db.query(string, answerId)
    })
    .then(data => {
      db.query(`
      SELECT answers from answer
      `)
    })
    .then(data => {
      let templateVar = { attempt: data.rows[0], answers: req.body}
      res.render('../views/confirm', templateVar)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })


  return router;
};
