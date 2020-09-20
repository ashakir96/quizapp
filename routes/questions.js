const { response } = require('express');
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
    let values = [req.params.questionId, req.body.answer1, req.body.isCorrecta1, req.body.answer2, req.body.isCorrecta2,
    req.body.answer3, req.body.isCorrecta3, req.body.answer4, req.body.isCorrecta4,];
    let query = `
        INSERT INTO answers (question_id, answer, isCorrect)
        VALUES
            ($1, $2, $3), ($1, $4, $5), ($1, $6, $7), ($1, $8, $9)
        RETURNING *;
        `;
    db.query(query, values)
      .then(async(data) => {
        const questionID = await(data.rows[0].question_id);
        db.query(`
          SELECT quiz_id FROM questions WHERE questions.id = $1;
        `, [questionID])
        .then(async(response) => {
          let quizid = await(response.rows[0].quiz_id);
          res.redirect(`/quiz/${quizid}`);
        })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
