const express = require('express');
const router = express.Router();
const path = require("path");

// render all the records with even and odd row
router.get('/sports-keeda',(req, res)=>{
    res.render('home',{title:"Home | Sports Keeda fetching data", home:"Sports Keeda"});
});

// render all data including pgination
router.get('/sports-keeda/pagination',(req, res)=>{
    res.render('showmore-page',{title:"Home | Sports Keeda fetching data", home:"Sports Keeda"});
});

router.get('/json-data', (req, res)=>{
    const result = {data:[], status:false}
    const fs = require('fs');
    let obj;
    const  joinDataPath = path.join(__dirname,'../public/data');
    var filePath = joinDataPath + '\\sportskeeda-feed.json';
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return res.send(result);
        };
        obj = JSON.parse(data);
        result.status = true;
        result.data = obj.data['rows'];
        res.send(result);
    });
})

router.get('/paginate', (req, res)=>{
    const result = {data:[], status:false, paginationState:true}
    const fs = require('fs');
    let obj;
    var getData = req.query;
    const  joinDataPath = path.join(__dirname,'../public/data');
    var filePath = joinDataPath + '\\sportskeeda-feed.json';
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return res.send(result);
        };
        obj = JSON.parse(data);
        result.status = true;
        var news = obj.data['rows'];
        var splitData = [];
        if(getData.paginationLimit > news.length){
            result.data = news;
            result.paginationState = false;
        }else{
            splitData = (news).slice(0, getData.paginationLimit)
            result.data = splitData;
        }
        res.send(result);
    });
})









module.exports = router;