var members = require('../config/members.json');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(members);
    res.render('group', { 
        members: members,
        title: 'Twitter Analyze', 
        breadcrumb: 'Group'
    });
});

module.exports = router;