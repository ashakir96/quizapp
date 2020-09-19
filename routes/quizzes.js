/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/:quizid/questions", (req, res) => {
    req.session.quiz_id = req.params.quizid;
    let templateVar = { quizId: req.params.quizid};
    res.render('../views/questions', templateVar);
  })

  router.get("/:quizid/questions/:questionid", (req, res) => {
    db.query(`SELECT question FROM questions WHERE id = $1`, [req.params.questionid])
    .then(data => {
      let question = data.rows[0].question;
      let templateVars = {quiz_id: req.params.quizid, question_id: req.params.questionid, question};
      res.render('../views/answers', templateVars);
    })
  })

  router.post("/:quizid/questions", (req, res) => {
    let query = `INSERT INTO questions (quiz_id, question)
                VALUES ($1, $2) RETURNING *`;
    let values = [req.params.quizid, req.body.question];
    req.session.quiz_id = req.params.quizid;
    db.query(query, values)
      .then(data => {
        const question = data.rows;
        let questionID = question[0].id
        res.redirect(`/quiz/${req.params.quizid}/questions/${questionID}`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

  return router;
};
