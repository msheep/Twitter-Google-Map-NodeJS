var client = require('nano')('http://115.146.95.80:5984');
var db = client.db.use('tweets');
var async = require('async');
var express = require('express');
var router = express.Router();

var politicsName = ["all","General","ALP","LIB","GRN","NAT","CLP","FFP","KAP","JLN","LDP","AMEP","PUP","NXT","Lazarus","Madigan","McGowan","Wilkie"]
var politicsShowName = ["all","General","Australian Labor Party","Liberal Party", "The Greens","National Party of Australia","Country Liberal Party","Family First Party","Katter's Australian Party","Jacqui Lambie Network","Liberal Democratic Party","Australian Motoring Enthusiast Party","Palmer United Party","Nick Xenophon Team","Glenn Lazarus Team","John Madigan","Cathy McGowan","Andrew Wilkie"]

function getFooty(politicsId, callback){
    var footy = new Array();
    var polarity_total = 0.0;
    var sentiment = new Array();
    for(var i = 0; i < politicsName.length; i++){
        sentiment[i] = new Array();
        sentiment[i]["positive"] = 0;
        sentiment[i]["negative"] = 0;
        sentiment[i]["neutral"] = 0;
    }
    db.view("topic", "politics", {"group": true, "reduce": true}, function(err, body) {
        if (err) {
            console.log("This is error "+err);
            status = {'error': err};
        } else {
            body.rows.forEach(function(doc) {
                if(politicsId != 0){
                    if(doc.key[0].toLowerCase() == politicsName[politicsId].toLowerCase()){
                        footy.push([doc.key[0],doc.key[1],doc.key[2],doc.key[3],doc.key[4]]);
                        polarity_total += doc.key[5];
                        sentiment[politicsId][doc.key[2]] += 1;
                    }
                }else{
                    footy.push([doc.key[0],doc.key[1],doc.key[2],doc.key[3],doc.key[4]]);
                    polarity_total += doc.key[5];
                    for(var i = 0; i < politicsName.length; i++){
                        if(politicsName[i].toLowerCase() == doc.key[0].toLowerCase()){
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
    var politicsId = req.query.politics;
    if(!politicsId){
        politicsId = 0;
    }
    getFooty(politicsId, function(politicsInfo, polarity_total, sentiment){
        var total = politicsInfo.length;
        var polarity_avg = (polarity_total/total).toFixed(8);
        res.render('politics', { 
            title: 'Twitter Analyze', 
            breadcrumb: 'Politics',
            politicsId: politicsId,
            total: total,
            politicsInfo: JSON.stringify(politicsInfo),
            politicsName: politicsName,
            politicsShowName: politicsShowName,
            polarity_avg: polarity_avg,
            sentiment: sentiment
        });
    })
    
});

module.exports = router;