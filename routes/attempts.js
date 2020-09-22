const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // router.get("/attempts/:attemptid/user/:user_id", (req, res) => {
  //   res.render(data => {

  //   });
  // });

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

  router.post("/:quiz_id/:user_id", (req, res) => {
    req.session = req.body;
    db.query(`
    INSERT INTO quiz_attempts (quiz_id, user_id) VALUES ($1, $2) RETURNING *;
    `, [req.params.quiz_id, req.params.user_id])
      .then(() => {
        let answerIds = Object.values(req.body);
        let string = `
      INSERT INTO answer_attempts (answer_id, user_id) VALUES `;
        for (let answerId of answerIds) {
          if (answerIds.indexOf(answerId) === (answerIds.length - 1)) {
            string += `(${answerId}, ${req.params.user_id}) RETURNING *;`
          } else {
            string += `(${answerId}, ${req.params.user_id}), `;
          }
        }
        return db.query(string);
      })
      .then(data => {
        let arr = [];
        for (let item of data.rows) {
          arr.push(item.answer_id);
        };
        let qstring2 = `
        SELECT question, answer, isCorrect, answer_attempts.user_id
        FROM questions
        JOIN answers ON questions.id = answers.question_id
        JOIN quizzes ON quiz_id = quizzes.id
        JOIN answer_attempts ON answer_id = answers.id
        WHERE quiz_id = ${req.params.quiz_id} `;
        for (let id of arr) {
          if (arr.length === 1) {
            qstring2 += `AND answer_id = ${id} GROUP BY question, answer, isCorrect, answer_attempts.user_id;`;
          } else {
            if (arr.indexOf(id) === (arr.length - 1)) {
              qstring2 += `OR answer_id = ${id} GROUP BY question, answer, isCorrect, answer_attempts.user_id;`;
            } else if (arr.indexOf(id) === 0) {
              qstring2 += `AND answer_id = ${id} `;
            } else {
              qstring2 += `OR answer_id = ${id} `;
            }
          }
        }
        return db.query(qstring2);
      })
      .then(data => {
        let templateVar = { attempt: data.rows, quiz_id: req.params.quiz_id };
        res.render('../views/results', templateVar);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })


  return router;
};
