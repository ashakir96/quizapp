/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get('/:id', (req, res) => {
    db.query(`
    SELECT quizzes.id, users.id AS user_id, users.name AS users_name, quizzes.name, quizzes.description, isPrivate
    FROM quizzes
    JOIN users ON user_id = users.id
    WHERE user_id = $1
    GROUP BY quizzes.id, users.id, users.name, quizzes.name, quizzes.description, isPrivate;
    `, [req.params.id])
      .then(user => {
        let templateVar = {userData: user.rows, user_id: req.params.id};
        console.log(templateVar);
        res.render("../views/user_home", templateVar);
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: error.message });
      });
  });

  router.get("/createquiz/:user_id", (req, res) => {
    let templateVar = { userId: req.params.user_id };
    res.render('../views/createQuiz', templateVar);
  })


  router.post("/:user_id/createquiz", (req, res) => {
    let query = `INSERT INTO quizzes (user_id, name, description, isPrivate)
                VALUES ($1, $2, $3, $4) RETURNING id`;
    let values = [req.params.user_id, req.body.name, req.body.description, req.body.isPrivate];
    db.query(query, values)
      .then(data => {
        const quiz = data.rows;
        let quizid = data.rows[0].id
        res.redirect(`/quiz/${quizid}/questions`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  router.post("/:user_id/delete/:quiz_id", (req, res) => {
    db.query(`DELETE FROM quizzes WHERE id = $1 AND user_id = $2;`,
    [req.params.quiz_id, req.params.user_id])
    .then(() => {
      res.redirect(`/users/${req.params.user_id}`);
    });
  });


  return router;
};
