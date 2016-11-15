
const SerialPort = require("serialport");
const jsonfile = require('jsonfile');
const moment = require('moment');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const twitter = require('twitter');

const config = require('./config.json');
const twiConf = require('./twitter.json');
console.log(config.rate);
const port = {name: config.usbPort, rate: config.rate};
let name = "./data/delete_me_im_lazy.json";//hardcoded for testing purposes, leave empty otherwise

var url = 'mongodb://localhost:27017/weather';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

var serialport = new SerialPort(port.name, {
  baudRate: port.rate,
  parser: SerialPort.parsers.readline('\n')
});
serialport.on('open', function(){
  console.log('Serial Port Opened');
  serialport.on('data', function(data){
    if (data.length > 140) {
      writeJsonFile(data);
      terminalOutput(data);
    }else if(data.length == 0){
      console.log("No data");
    }else{
      console.log(data);
    }
    // console.log(data);
  });
});

function writeJsonFile(string){
  let filename = './data/'+moment().format("DD_MM_YYYY")+'.json';
  fs.access(filename, fs.F_OK, function(err) {
    if (!err) {
      fs.appendFile(filename, moment().format('"HH:mm":')+string+",", function (err){
        if (err) {
          console.log(err);
        }
      }); //fs appendFile
    } else { //if no file was found
      fs.writeFile(filename, '"data":{['+moment().format('"HH:mm":')+string+",", function(err){
        if (err) {
          console.log(err);
        }
      });//writeFile
      fs.appendFile(name, '"99:99":{"status": "end of the day"}]};', function(err){
        if (err) {
          console.log(err);
        }else{
          name = filename;
        }
      });//appendFile
    }
  });//access
}

function terminalOutput(string) {
  let data = JSON.parse(string);
  //{rainD:1, rainA:1023, status: "working", humidity: 36.00,
  // tempOne: 23.00, altProv:236, tempTwo: 23.79, pressureAbs: 976.90,
  // pressureRel: 1004.69, altComp: 236}
  function rain(rainD, rainA){
    if(!rainD){
      return rainA;
    }else{
      return "nope!";
    }
  };
  //Boolean(data.rainD)
  //rain(data.rainD, data.rainA)
  //data.tempTwo
  console.log("|==================\t***\t==================|");
  console.log("| Outdoors t.:\t"+-4+" C\t | Indoors t.: \t"+data.tempOne+" C\t  |");
  console.log("| Pressure: \t"+data.pressureRel+"\t | Humidity: \t"+data.humidity+"% \t  |");
  console.log("| Altitude: \t"+data.altComp+" m.\t | Snowing: \t"+"hard!"+"\t  |" );
  console.log("|=="+moment().format("= DD.MM.YYYY ===\t***\t==== HH:mm:ss =")+"===|");
  console.log("|__________________\t___\t__________________|");
}

// var client = new twitter({
//   consumer_key: process.env.TWITTER_CONSUMER_KEY,
//   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//   access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// });
// client.get('favorites/list', function(error, tweets, response) {
//   if(error) throw error;
//   console.log(tweets);  // The favorites.
//   console.log(response);  // Raw response object.
// });
