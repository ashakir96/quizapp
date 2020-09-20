const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get('/questions/:questionid', (req, res) => {
    db.query(`SELECT question FROM questions WHERE id = $1;`, [req.params.questionid])
    .then(data => {
      let question = data.rows[0].question;
      let templateVars = {question_id: req.params.questionid, question };
      res.render('../views/question', templateVars);
    });
  });

  router.post('/:questionId', (req, res) => {
    console.log(req.body);
    let values = [req.params.questionId, req.body.answer1, req.body.isCorrecta1, req.params.questionId, req.body.answer2, req.body.isCorrecta2,
      req.params.questionId, req.body.answer3, req.body.isCorrecta3, req.params.questionId, req.body.answer4, req.body.isCorrecta4, ];
    console.log(values);
      let query = `
     INSERT INTO answers (question_id, answer, isCorrect) VALUES ($1, $2, $3);
     INSERT INTO answers (question_id, answer, isCorrect) VALUES ($4, $5, $6);
     INSERT INTO answers (question_id, answer, isCorrect) VALUES ($7, $8, $9);
     INSERT INTO answers (question_id, answer, isCorrect) VALUES ($10, $11, $12) RETURNING *;
    `;
    req.session.question_id = req.params.questionId;
    db.query(query, values)
      .then(data => {
        const questionID = data.rows[0].question_id;
        res.redirect(`/questions/${questionID}`)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });
  return router;
};
