const express = require('express');
const router = express.Router();

module.exports = (db) => {


  //home page to see public quizzes

  router.get('/:user_id', (req, res) => {
    req.session.user_id = req.params.user_id;
    db.query(`
    SELECT * FROM quizzes WHERE isPrivate = FALSE;
    `)
    .then(data => {
      const templateVar = {quizzes: data.rows, user_id: req.params.user_id};
      res.render('../views/index', templateVar);
    })
  });
  return router;
};
