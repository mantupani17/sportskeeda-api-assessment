const https = require('https');

module.exports.jobExportCsv = function(){
    https.get('https://login.sportskeeda.com/en/feed?page=1', (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                const result =  JSON.parse(data).cards;
                console.log(result)
                return result;
            });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}



