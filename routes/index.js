const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.query(`
    SELECT * FROM quizzes WHERE isPrivate = FALSE;
    `)
    .then(data => {
      const templateVar = {quizzes: data.rows};
      res.render('../views/index', templateVar);
    })
  });
  return router;
};
