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

  router.get('/:quizid/:questionid', (req, res) => {
    let query = `
      SELECT quizzes.name, questions.question, answers.answer, answers.isCorrect
      FROM answers
      JOIN questions ON questions.id = answers.question_id
      JOIN quizzes ON quiuzzes.id = questions.quiz_id
      WHERE quiz_id = $1
      RETURNING *;
    `;
    let values = [req.params.quizid];
    db.query(query, values)
      .then(data => {
        let questions = data.rows;
        templateVars = { questions };
        console.log(data.rows);
        res.render('../views/quiz_in_prog', templateVars);
      })
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
    req.session.quiz_id = req.params.quiz_id;
    db.query(query, values)
      .then(data => {
        const questionID = data.rows[0].question_id;
        return db.query(`
          SELECT quiz_id FROM questions WHERE questions.id = $1 RETURNING quiz_id;
        `, [questionID])
          .then(response => {
            let quizid = response.rows[0].quiz_id;
            res.redirect(`/${quizid}/${questionID}`);
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
