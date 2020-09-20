const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get('/:questionid', (req, res) => {
    db.query(`SELECT question FROM questions WHERE id = $1;`, [req.params.questionid])
      .then(data => {
        let question = data.rows[0].question;
        let templateVars = { question_id: req.params.questionid, question };
        res.render('../views/questions', templateVars);
      });
  });

  router.post('/:questionId', (req, res) => {
    let values = [req.params.questionId, req.body.answer1, req.body.isCorrecta1, req.params.questionId, req.body.answer2, req.body.isCorrecta2,
    req.params.questionId, req.body.answer3, req.body.isCorrecta3, req.params.questionId, req.body.answer4, req.body.isCorrecta4,];
    let query = `
        INSERT INTO answers (question_id, answer, isCorrect)
        VALUES
            ($1, $2, $3), ($4, $5, $6), ($7, $8, $9), ($10, $11, $12)
        RETURNING *;
        `;
    req.session.quiz_id = req.params.quiz_id;
    db.query(query, values)
      .then(data => {
        const questionID = data.rows[0].question_id;
        res.redirect(`/quiz/quizid/questions/${questionID}`)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
