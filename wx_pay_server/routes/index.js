var express = require('express');
var router = express.Router();
var dao = require('./common/db.js')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/query', async function (req, res, next) { 
  let result = await dao.query({ id: 1 }, 'users')
  console.log(result);
  res.json(result)
})

module.exports = router;