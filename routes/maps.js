var client = require('nano')('http://115.146.95.126:5984');
var db = client.db.use('twitter');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

    // twitter.list(function(err, body){
    //   console.log(body.rows);
    // })

  res.render('maps', { 
        title: 'Twitter Analyze', 
        breadcrumb: 'Maps'
    });
});

module.exports = router;
