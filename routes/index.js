var client = require('nano')('http://115.146.95.80:5984/');
var db = client.db.use('tweets');
var express = require('express');
var members = require('../config/members.json');
var router = express.Router();

function getAvgPolarity(callback) {
    var polarity_avg = 0.0;
    db.view("common", "polarity", {"group": true, "reduce": true}, function(err, body) {
        if (err) {
            logger.error(err);
            status = {'error': err};
        } else {
            body.rows.forEach(function(doc) {
                polarity_avg = doc.value.toFixed(8);
            });
        }
        callback(polarity_avg);
    });
}

function getAvgSubjectivity(callback) {
    var subjectivity_avg = 0.0;
    db.view("common", "subjectivity", {"group": true, "reduce": true}, function(err, body) {
        if (err) {
            logger.error(err);
            status = {'error': err};
        } else {
            body.rows.forEach(function(doc) {
                subjectivity_avg = doc.value.toFixed(8);
            });
        }
        callback(subjectivity_avg);
    });
}

function getSentiment(callback) {
    var sentiment = [];
    var total = 0 
    db.view("common", "sentiment", {"group": true, "reduce": true}, function(err, body) {
        if (err) {
             console.log(err);
            status = {'error': err};
        } else {
            body.rows.forEach(function(doc) {
                sentiment.push([doc.key, doc.value]);
                total += doc.value;
            });
        }
        callback(sentiment, total);
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    getAvgPolarity(function(polarity_avg){
        console.log(polarity_avg);
        getAvgSubjectivity(function(subjectivity_avg){
            console.log(subjectivity_avg);
            getSentiment(function(sentiment, total){
                console.log(total)
                res.render('index', { 
                    title: 'Twitter Analyze', 
                    breadcrumb: 'Dashboard', 
                    polarity_avg: polarity_avg,
                    members: members,
                    subjectivity_avg: subjectivity_avg,
                    sentiment: sentiment,
                    total: total
                });
            });
        });
    })
});

module.exports = router;
