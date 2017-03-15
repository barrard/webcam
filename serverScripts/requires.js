serverFunctions = require('./serverFunctions.js')
databaseFunctions = require('./databaseFunctions.js')

express = require('express');
socketio = require('socket.io')
Jimp = require("jimp");
compression = require('compression')
querystring = require('querystring');
fs = require("fs");

https = require('https');
http = require('http');
httpRD = require('http');
favicon = require('serve-favicon');
app = express();
serverRD = httpRD.Server(app);
WebSocket = require('ws').Server
cookieParser=require('cookie-parser')
bodyParser = require('body-parser');
session=require('express-session')

MongoStore = require('connect-mongo')(session);

MongoClient = require('mongodb').MongoClient

OS = require('os')
formidable = require('formidable');
path = require('path');
request = require("request");
cheerio = require("cheerio");

passwordHash = require('password-hash')