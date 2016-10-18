var express = require("express");
var fs = require('fs');
var passport = require('passport');
var serverConfig = express();
var localStrategy = require('passport-local').Strategy;
var configurationFile = 'gatewayConfig.json';
var keysFile = 'keys.json';

function writeFile(type, incomingData, successCallback, errorCallback) {

  fs.readFile(configurationFile, 'utf8', function (err, data) {
    if (err)
      errorCallback(err);

    var localData = JSON.parse(data);

    if (type == "adm") {
      if (incomingData.password) {
        localData.administration.password = incomingData.password;
      }

      if (incomingData.firmware && incomingData.firmware.name && incomingData.firmware.base64) {
        localData.administration.firmware.name = incomingData.firmware.name;
        localData.administration.firmware.base64 = incomingData.firmware.base64;
      }

      localData.administration.remoteSshPort = incomingData.remoteSshPort;
      localData.administration.allowedPassword = incomingData.allowedPassword;
      localData.administration.sshKey = incomingData.sshKey;
    }
    else if (type == "net") {

      localData.network.automaticIp = incomingData.automaticIp;

      if (incomingData.automaticIp == false) {
        localData.network.ipaddress = incomingData.ipaddress;
        localData.network.defaultGateway = incomingData.defaultGateway;
        localData.network.networkMask = incomingData.networkMask;
      }
      else {
        localData.network.ipaddress = "";
        localData.network.defaultGateway = "";
        localData.network.networkMask = "";
      }
    }

    fs.writeFile(configurationFile, JSON.stringify(localData), 'utf8', successCallback);
  });
}

serverConfig.use(express.static(__dirname + '/'));

/* serves main page */
serverConfig.get("/", function (req, res) {
  res.sendfile('signin.html');
});

serverConfig.get("/main", function (req, res) {
  res.sendfile('main.html');
});

serverConfig.post("/user/authentication", function (req, res) {
  //TODO
  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var jsonObj = JSON.parse(body);
    authenticated = true;
    /*   passport.use(new LocalStrategy(
         function (username, password, done) {
           User.findOne({ username: username }, function (err, user) {
             if (err) { return done(err); }
             if (!user) {
               return done(null, false, { message: 'Incorrect username.' });
             }
             if (!user.validPassword(password)) {
               return done(null, false, { message: 'Incorrect password.' });
             }
             return done(null, user);
           });
         }
       )); */
    res.end();
  });





});

serverConfig.post("/administration/save", function (req, res) {

  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var jsonObj = JSON.parse(body);
    writeFile("adm", jsonObj, function () {
      console.log("success");
    }, function (error) {
      console.log(error);
    });

    res.end();
  });
});

serverConfig.get("/administration/info", function (req, res) {
  var obj;
  fs.readFile('gatewayConfig.json', 'utf8', function (err, data) {
    if (err)
      throw err;

    obj = JSON.parse(data);

    var admObject = {
      "password": "xxxxxxxxxx",
      "remoteSshPort": obj.administration.remoteSshPort,
      "allowedPassword": obj.administration.allowedPassword,
      "sshKey": obj.administration.sshKey,
      "firmware": obj.administration.firmware.name
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(admObject);
  });
});


serverConfig.post("/network/save", function (req, res) {

  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var jsonObj = JSON.parse(body);
    writeFile("net", jsonObj, function () {
      console.log("success");
    }, function (error) {
      console.log(error);
    });

    res.end();
  });
});

serverConfig.get("/network/info", function (req, res) {
  var obj;
  fs.readFile('gatewayConfig.json', 'utf8', function (err, data) {
    if (err)
      throw err;
    obj = JSON.parse(data);
    res.setHeader('Content-Type', 'application/json');
    res.send(obj.network);
  });
});

serverConfig.post("/devices/save", function (req, res) {
  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    try {
      var jsonObj = JSON.parse(body);
    } catch(e) {
      throw e;
    }

    fs.writeFile(keysFile, JSON.stringify(jsonObj), 'utf8', function(err){
      if (err) throw err;
    });
    res.end();
  });
});

serverConfig.get("/devices/info", function (req, res) {
  var obj;
  fs.readFile(keysFile, 'utf8', function (err, data) {
    if (err) throw err;

    try {
      obj = JSON.parse(data);
    } catch(e) {
      throw e;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(obj);
  });
});

var port = process.env.PORT || 8080;
serverConfig.listen(port, function () {
  console.log("Listening on " + port);
});
