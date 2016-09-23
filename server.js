var express = require("express");
var fs = require('fs');
var passport = require('passport');
var serverConfig = express();
var localStrategy = require('passport-local').Strategy;
var configurationFile = 'gatewayConfig.json';
var exec = require('child_process').exec;

function stopKnotd(){
  exec("kill -15 -'cat /tmp/$1.pid'", function(error, stdout, stderr) {
    if(!error){
      console.log("success");
    }
    else{
      console.log("failure");
    }
  });
}

/*function startKnotd(){
  fs.readFile('gatewayConfig.json', 'utf8', function (err, data) {
    if (err)
      throw err;
    obj = JSON.parse(data);
    var knotd_conf = {
      "proto" : "http",
      "host" : obj.cloud.serverName != "" ? obj.cloud.serverName : null,
      "port" : obj.cloud.port != "" ? obj.cloud.port : null,
      "uuid" : obj.cloud.uuid != "" ? obj.cloud.uuid : null,
      "token" : obj.cloud.token != "" ? obj.cloud.token : null
    };
    fs.writeFile("knot.conf", "[Credential]\n" + "UUID=" + knotd_conf.uuid +
                                          "\nTOKEN=" + knotd_conf.token, 'utf8');
    if(knotd_conf.uuid != null && knotd_conf.token != null){
      exec('./knotd --config=knot.conf --proto=http --host='+knotd_conf.host+
                   ' --port='+knotd_conf.port, function(error, stdout, stderr) {
        //./etc/knotd/start.sh ./knotd --config=knot.conf --proto=http --host=localhost --port=8000

      });
    }
  });
}*/

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
    else if (type == "radio") {
      localData.radio.channel = incomingData.channel;
      localData.radio.pwrRating = incomingData.pwrRating;
      localData.radio.attempt = incomingData.attempt;
      localData.radio.security = incomingData.security;
      localData.radio.key = incomingData.key;
    }
    else if (type == "cloud") {
      localData.cloud.serverName = incomingData.serverName;
      localData.cloud.port = incomingData.port;
      localData.cloud.uuid = incomingData.uuid;
      localData.cloud.token = incomingData.token;
    }
    else if (type == "user") {
        localData.user.email = incomingData.email;
        localData.user.password = incomingData.password;
    }

    fs.writeFile(configurationFile, JSON.stringify(localData), 'utf8', successCallback);
    /*restart knotd*/
    stopKnotd();
    /*exec('./etc/knotd/stop.sh knotd', function(error, stdout, stderr) {
      if(!error){
        startKnotd();
      }
    });*/
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
serverConfig.get("/signup", function (req, res) {
  res.sendfile('views/signup.html');
});

serverConfig.post("/knotd", function(req, res) {
  var cmd = 'gedit ~/Desktop/hello.c';
  exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
  });
});

serverConfig.post("/user/authentication", function (req, res) {
  //TODO
  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var reqObj = JSON.parse(body);
    fs.readFile('gatewayConfig.json', 'utf8', function (err, data2) {
      if (err)
        throw err;

      obj = JSON.parse(data2);
      var outdata = {
        "authenticated" : "false"
      }

      if (reqObj.user == obj.user.email && reqObj.password == obj.user.password){
        outdata.authenticated = true;
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(outdata);
    })
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
  });
});

serverConfig.post("/user/subscription", function (req, res) {
  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var jsonObj = JSON.parse(body);
    writeFile("user", jsonObj, function () {
      console.log("success");
    }, function (error) {
      console.log("error");
    });
  });
  res.end();
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

serverConfig.post("/radio/save", function (req, res) {

  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var jsonObj = JSON.parse(body);
    writeFile("radio", jsonObj, function () {
      console.log("success");
    }, function (error) {
      console.log(error);
    });

    res.end();
  });
});

serverConfig.get("/radio/info", function (req, res) {
  var obj;
  fs.readFile('gatewayConfig.json', 'utf8', function (err, data) {
    if (err)
      throw err;
    obj = JSON.parse(data);
    res.setHeader('Content-Type', 'application/json');
    res.send(obj.radio);
  });
});

serverConfig.post("/cloud/save", function (req, res) {

  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var jsonObj = JSON.parse(body);
    writeFile("cloud", jsonObj, function () {
      console.log("success");
    }, function (error) {
      console.log(error);
    });

    res.end();
  });
});

serverConfig.get("/cloud/info", function (req, res) {
  var obj;
  fs.readFile('gatewayConfig.json', 'utf8', function (err, data) {
    if (err)
      throw err;
    obj = JSON.parse(data);
    res.setHeader('Content-Type', 'application/json');
    res.send(obj.cloud);
  });
});

var port = process.env.PORT || 8080;
serverConfig.listen(port, function () {
  console.log("Listening on " + port);
});
