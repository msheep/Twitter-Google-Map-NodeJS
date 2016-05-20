var client = require('nano')('http://115.146.95.80:5984');
var db = client.db.use('tweets');
var async = require('async');
var express = require('express');
var router = express.Router();

var teams = ["all","NTHMELB","Geelong","Sydney","Bulldogs","GWS","Hawthorn","Westcoast","Adelaide","Melbourne","Port","GoldCoast","Carlton","StKilda","Collingwood","Richmond","Brisbane","Essendon","FreMantle", "general"];

var teamsShowName = ["all","North Melbourne Kangaroos","Geelong Cats","Sydney Swans","Western Bulldogs","Greater Western Sydney Giants","Hawthorn Hawks","West Coast Eagles","Adelaide Crows","Melbourne Demons","Port Adelaide Power","Gold Coast Suns","Carlton Blues","St Kilda Saints","Collingwood Magpies","Richmond Tigers","Brisbane Lions","Essendon Bombers","Fremantle Dockers", "General"];

function getFooty(teamId, callback){
    var footy = new Array();
    var polarity_total = 0.0;
    var sentiment = new Array();
    for(var i = 0; i < teams.length; i++){
        sentiment[i] = new Array();
        sentiment[i]["positive"] = 0;
        sentiment[i]["negative"] = 0;
        sentiment[i]["neutral"] = 0;
    }
    db.view("topic", "footy", {"group": true, "reduce": true}, function(err, body) {
        if (err) {
            console.log("This is error "+err);
            status = {'error': err};
        } else {
            body.rows.forEach(function(doc) {
                if(teamId != 0){
                    if(doc.key[0].toLowerCase() == teams[teamId].toLowerCase()){
                        footy.push([doc.key[0],doc.key[1],doc.key[2],doc.key[3],doc.key[4]]);
                        polarity_total += doc.key[5];
                        sentiment[teamId][doc.key[2]] += 1;
                    }
                }else{
                    footy.push([doc.key[0],doc.key[1],doc.key[2],doc.key[3],doc.key[4]]);
                    polarity_total += doc.key[5];
                    for(var i = 0; i < teams.length; i++){
                        if(teams[i].toLowerCase() == doc.key[0].toLowerCase()){
                            sentiment[i][doc.key[2]] += 1;
                        }
                    }
                }
            })
        }
        callback(footy, polarity_total, sentiment);
    });
} 

/* GET users listing. */
router.get('/', function(req, res, next) {
    var teamId = req.query.team;
    if(!teamId){
        teamId = 0;
    }
    getFooty(teamId, function(footy, polarity_total, sentiment){
        var total = footy.length;
        var polarity_avg = (polarity_total/total).toFixed(8);
        res.render('footy', { 
            title: 'Twitter Analyze', 
            breadcrumb: 'Footy',
            teamId: teamId,
            total: total,
            footy: JSON.stringify(footy),
            teams: teams,
            teamsShowName: teamsShowName,
            polarity_avg: polarity_avg,
            sentiment: sentiment
        });
    })
    
});

module.exports = router;