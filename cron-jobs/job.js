const cron = require("node-cron");
const https = require('https');
const fs = require("fs");
const path = require('path');
const exportCsvJob = require('../jobs/export-csv-job');
const async = require('async');
var json2csv = require('json2csv').parse;



// schedule tasks to be run on the server   
cron.schedule("0 0 */1 * *", function () {
        let newsData = [];
        let preparedNewsData = [];
        let allData = [];
        const distinctArray = [];
        const destinedPath = path.join(__dirname, '../dump-files');
        let news = {
            id: '',
            post_title: '',
            url: '',
            category: '',
            no_reads: ''
        }
        var exDataCsv = [];
        // get all data 
        var getData = function (cb) {
            https.get('https://login.sportskeeda.com/en/feed?page=2', (resp) => {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    newsData = JSON.parse(data).cards;
                    return cb();
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }

        // prepare json object with some fields
        var prepareData = function (cb) {
            for (var i = 0; i < newsData.length; i++) {
                var news = {
                    id: newsData[i].ID,
                    post_title: newsData[i].title,
                    url: newsData[i].permalink,
                    category: newsData[i].type,
                    no_reads: newsData[i].read_count
                }
                preparedNewsData.push(news);
            }
            return cb();
        }

        // create CSV file
        var createCsvFile = function (cb) {
            let currentDate = new Date();
            const month = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
            // sk_csv_hour:minute_day_month_year this format is not acceptable because of this : so instead of that i used _
            const fileName = 'sk_csv_' + currentDate.getHours() + '_' + currentDate.getMinutes() + '_' + currentDate.getDate() + '_' + month[currentDate.getMonth()] + '_' + currentDate.getFullYear();
            try {
                const csv = json2csv(preparedNewsData, Object.keys(news));
                fs.writeFile(destinedPath + '\\' + fileName + '.csv', csv, function (err) {
                    if (err) {
                        console.log(err)
                        throw err;
                    }
                    console.log('file saved');
                    return cb()
                });
            } catch (err) {
                console.error(err);
            }
        }

        // create Master CSV file with unique record
        var generateMasterCSV = function(cb){
            var csv = require("csvtojson");
            fs.readdir(destinedPath, function(err, files) {
                if (err) {
                    throw err;
                } else {
                if (!files.length) {
                    // directory appears to be empty
                    console.log('This folder is empty so we can not create master file');
                    return cb();
                }else{
                        var allUniqueData = [];
                        // read all csv files and create unique array of objects    
                        var readAllCSVFiles = function(callback){
                            for(var i=0; i<files.length;i++){

                                allUniqueData.push(
                                    csv()
                                    .fromFile(destinedPath + '\\' +files[i])
                                    .then(function(jsonArrayObj){ 
                                        return jsonArrayObj;
                                    })
                                );
                                    
                            }
                            
                            Promise.all(allUniqueData).then(function(values) {
                                exDataCsv=values;
                                return callback();
                            });
                        }

                        // getting all unique objects
                        var getUniqueObjects = function(callback){
                            for(var key in exDataCsv){
                                var csvData = exDataCsv[key];
                                for(var key1 in csvData){
                                    allData.push(csvData[key1])
                                }
                            }
                            const map = new Map();
                            for (const item of allData) {
                                if(!map.has(item.id)){
                                    map.set(item.id, true);    // set any value to Map
                                    distinctArray.push(item);
                                }
                            }
                            return callback();
                        }


                        // GENERATING MASTER CSV
                        var createMasterCsv = function(callback){
                            try {
                                const csv = json2csv(distinctArray, Object.keys(news));
                                fs.writeFile(destinedPath + '\\sk_master.csv', csv, function (err) {
                                    if (err) {
                                        console.log(err)
                                        throw err;
                                    }
                                    console.log('master file saved');
                                    return callback()
                                });
                            } catch (err) {
                                console.error(err);
                                return callback()
                            }
                        }

                        async.series([readAllCSVFiles, getUniqueObjects, createMasterCsv], function(err, result){
                            if(err){
                                throw err;
                            }
                            return cb();
                        })
                }
                }
            });
        }

        async.series([getData, prepareData, createCsvFile, generateMasterCSV], function (err, result) {
            if (err) {
                throw err;
            }
        })
});
