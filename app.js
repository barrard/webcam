var DEVELOPMENT = true;
var PRODUCTION =false;

var requires = require('./serverScripts/requires.js')


if (DEVELOPMENT===true) {
//DEVELOPMENT USE
//dont use this, but saving for some reason
//  var sslOptions = {
//   key: fs.readFileSync('/home/sailor/nodeServers/digitalOcean/key.pem'),
//   cert: fs.readFileSync('/home/sailor/nodeServers/digitalOcean/key-cert.pem')
// };
//dev server
var server = http.createServer(app);
var io = socketio(server);
var wss = new WebSocket({ server: server })
}

if(PRODUCTION===true){
//PRODUCTION USE
var sslOptions = {
  key: fs.readFileSync('../../../../../../../../../../etc/letsencrypt/live/meetapp.us/privkey.pem'),
  cert: fs.readFileSync('../../../../../etc/letsencrypt/live/meetapp.us/fullchain.pem')
};

var httpsServer = https.createServer(sslOptions, app);
var io = socketio(httpsServer);
var wss = new WebSocket({ server: httpsServer })
}
ss = require('socket.io-stream')(io);


var url = 'mongodb://localhost:27017/users';
var HTTP_PORT  = 80;
var HTTPS_PORT = 443;
var loggedin;
var startGame;


app.use(compression())
var sessionOptions = {
  store: new MongoStore({
    url:'mongodb://localhost:27017/users'
      // db: 'users',
      // host: 'mongodb://localhost',
      // port: 27017
    }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:1000*60*60//one hour
  }
}
if(PRODUCTION===true){
   sessionOptions.cookie.secure = true // serve secure cookies
}
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(session(sessionOptions))
var sessionInfo={};
// io.use(function(socket, next) {
//     expressSession(socket.request, socket.request.res, next);
// });

var userLoggedIn;
app.enable('trust proxy');
app.set('username', 'null')
app.set('userLoggedIn', false)
app.set('clientDir', __dirname+'/client/')
// MongoClient.connect(url, function(err, db){
// 	if(!err){
// 		console.log("We are connected to "+db+", poolSize = ");
// 	}
// })

if (PRODUCTION===true) {
 app.all('/*', function(req, res, next) {   
  if (/^http$/.test(req.protocol)) {
     var host = req.headers.host.replace(/:[0-9]+$/g, ""); // strip the port # if any
     if ((HTTPS_PORT != null) && HTTPS_PORT !== 443) {
       return res.redirect(301, "https://" + host + ":" + HTTPS_PORT + req.url);
     } else {
       return res.redirect(301, "https://" + host + req.url);
     }
   } else {
     return next();
   }
 });
 };

 // app.get('/logout', function(req, res){
 //  userSession = {}
 //  console.log('userSession!!! '+JSON.stringify(userSession))
 //  res.redirect('/')

 // })

var scrapeSocket = io.of('/scrape').on('connection', function(socket){
  console.log('sockets in the house')
  socket.emit('connetion')
  socket.on('scrape', function(url){
    console.log('scrape er '+url)

    request(url, function(error, response, body) {
      console.log('requesting '+url)
        if (!error && response.statusCode === 200) {
            if (body) {
              // console.log(body)
              fs.writeFile(__dirname+'/client/scrape/iframe.html', body, function(err) {
                if (err) {
                 socket.emit('serverResponse', err)
                    return console.error(err);
                }else{
                console.log("Data written successfully! ");
                const buf4 = new Buffer('tést', 'utf8');
                console.log("Let's read newly written data")
                var chee = cheerio.load(body)
                tableData = chee('table').eq(3).html()
                var table3 = cheerio.load(tableData)
                  // IP_Trafic_data0 = table3('tr').eq(0).html()
                  IP_Trafic_data1 = table3('tr').eq(1).html()
                  IP_Trafic_data2 = table3('tr').eq(2).html()
                  IP_Trafic_data3 = table3('tr').eq(3).html()
                  IP_Trafic_data4 = table3('tr').eq(4).html()
                  IP_Trafic_data5 = table3('tr').eq(5).html()
                  IP_Trafic_data6 = table3('tr').eq(6).html()
                IPDataArray = [IP_Trafic_data1, IP_Trafic_data2, IP_Trafic_data3, IP_Trafic_data4, IP_Trafic_data5, IP_Trafic_data6]
                var final_IP_Data = []
                for(var x = 0;x<IPDataArray.length;x++){
                  var type, asis;
                  var $ = cheerio.load(IPDataArray[x])
                  //skip x = 2 and 3
                  if(x === 2|| x===3){continue}

                  if(x===0){
                    console.log('transmit IP traffic')
                    type = 'transmit'
                    asis = 'IP'
                  }
                  if(x===1){
                    console.log('Receive IP traffic')
                    type = 'receive'
                    asis = 'IP'

                  }
                  if(x===4){
                    console.log('Transmit ATM traffic')
                    type = 'transmit'
                    asis = 'ATM'

                  }
                  if(x===5){
                    console.log('Receive ATM traffic')
                    type = 'receive'
                    asis = 'ATM'

                  }
                  var ID = $('td').eq(0).text()
                  var Bytes = $('td').eq(1).text()
                  var Packets = $('td').eq(2).text()
                  var Errors = $('td').eq(3).text()
                  var Percent = $('td').eq(4).text()
                  console.log(ID)
                  console.log(Bytes)
                  console.log(Packets)
                  console.log(Errors)
                  console.log(Percent)
                  var data = {
                    id :ID,
                    type:type,
                    asis:asis,
                    bytes:Bytes,
                    packets:Packets,
                    errors:Errors,
                    perc:Percent,
                    dateTime:new Date()
                  }
                  final_IP_Data.push(data)
          
                }
                console.log(final_IP_Data)
                var url = 'mongodb://localhost:27017/users';
                MongoClient.connect(url, function(err, db) {
                  if(err){console.log('error final ip data')}
                    else{
                      var collection = db.collection('IPTraffic');
                      for(var x = 0;x<final_IP_Data.length;x++){
                        collection.insert(final_IP_Data[x], function(err, result){
                          if(err){console.log(err)}
                            else{console.log(result)}
                        })
                      }
                    }
                    db.close();
                })
                // console.log(tableData)
                var tableText = tableData
                // console.log(tableText)
              socket.emit('serverResponse', {status:'success', body:tableText})
              };
            });
            }else{
              console.log('no body?')
            }
          }else{
            socket.emit('serverResponse', error)
            console.log(error)
          }
        })
    })//scrape

})


 var teamBallSocket = io.of('/teamball').on('connection', function(socket){
   console.log('Teamballers!!!!`1`1`1`1`1`1`1`1`1`1`1`1`1`1')
      console.log('isTBlogin here')
      var socketCookies = socket.request.headers.cookie
      var indexOfTBlogin = socketCookies.indexOf('TBlogin=')
   if (indexOfTBlogin != -1) {
    console.log('index of login cookie is '+indexOfTBlogin +', which is not -1')
    var newCookieString = socketCookies.slice(indexOfTBlogin)
    var start = newCookieString.indexOf('=')
    var end = newCookieString.indexOf(';')
    start = start+1//to exclude the = sign
    var loginTruth = newCookieString.slice(start, end)
    console.log(loginTruth)
      if(loginTruth === 'true'){
         fs.readFile(__dirname + "/teamball/views/matchup.html", 'utf8', function(err, data){
          if (err) {console.log(err+' err getting teamball loginRegister.html')
          }else{
            console.log('Sending the teamball login')
            socket.emit('mainHTMLcontent', data)
          }
        })
      }else{
         fs.readFile(__dirname + "/teamball/views/loginRegister.html", 'utf8', function(err, data){
          if (err) {console.log(err+' err getting teamball loginRegister.html')
          }else{
            console.log('Sending the teamball login')
            socket.emit('mainHTMLcontent', data)
          }
        })
      }
   }else{
     fs.readFile(__dirname + "/teamball/views/loginRegister.html", 'utf8', function(err, data){
      if (err) {console.log(err+' err getting teamball loginRegister.html')
      }else{
        console.log('Sending the teamball login')
        socket.emit('mainHTMLcontent', data)
      }
    })
   }

   socket.emit('connection','This is the teamball namespace')
 })


app.get('/teamBall', function(req, res){
  // console.log(req.cookies)
  console.log('=-=-=-=-=-=-=-=-Teamball route-=-=-=-=-=-=-=-')
  // console.log(req.session.loggedin)
  // req.session.loggedin = true
  // req.session.teamName = ''
  // req.session.sessionID=req.session.id
  // res.cookie('.sid', '123')
  res.sendFile(__dirname+'/teamball/index.html')
  // console.log('TeamName? '+req.cookies.teamName)
  // if(req.cookies.teamName===undefined){
  //   io.on('connection', function(socket){
  //     fs.readFile(__dirname + "/client/teamBall/views/loginRegister.html", 'utf8', function(err, data){
  //       if (err) {
  //         console.log(err+' err getting teamball loginRegister.html')
  //       }else {
  //         console.log('Sending the teamball login')
  //         socket.emit('loginRegister', data)
  //       }
  //     })
  //   })
  // }else{
  //   io.on('connection', function(socket){
  //     fs.readFile(__dirname + "/client/teamBall/views/matchup.html", 'utf8', function(err, data){
  //       if (err) {
  //         console.log(err+' err getting teamball matchup.html')
  //       }else {
  //         console.log('Sending the teamball matchup '+req.cookies)
  //         socket.emit('mainContent', data)
  //       }
  //     })
  //   })
  // }
  

})
app.get('/getTeamInfo/:teamName/', function(req, res){
  console.log('{{{{{{{{{{{{{')
  console.log(sessionInfo)
  console.log('}}}}}}}}}}}}}')
  var teamName = sessionInfo.teamName
  var opponent = req.params.teamName
  console.log(teamName+' Vs. '+opponent)
  var responseObj = {}
  databaseFunctions.find$orInCollection('matchupHistory', function(result){
    if(result.length>0){
      console.log(result)
      console.log('found '+result.length+' results')
      responseObj ={teamInfo:'favke team info', teamHistory:result}
      res.send(responseObj)      
    }else{
      responseObj ={teamInfo:'favke team info', teamHistory:'No history'}
      res.send(responseObj)
    }
  })
  // res.send(teamNameToLookUp+' is being queried')
})
app.post('/teamballLoginRequest', function(req, res){
  console.log(req.session.id+' got sessions?')
  console.log('this is the post route for TB login')
  console.log('the name is ')
  console.log((req.body))
  console.log((req.body.teamName))
  console.log('Lets examine the post request')

  var userData = {'teamName':req.body.teamName, 'password':req.body.password}
  var method = req.body.method

  databaseFunctions.HandleUserLogin(method, userData, function(results){
    if(results.errorMessage===undefined){
      if(method === 'register'){
        res.send({errorMessage:'This username already exists!'})
      }else{
        res.cookie('teamName',req.body.teamName)
        req.session.loggedin = true
        req.session.teamName = userData['teamName']
        res.cookie('TBlogin','true', { expire: new Date() +1000*60*60 })
        res.sendFile(__dirname+'/teamball/views/matchup.html')
        // res.send({redirect:'/teamBallMatchup/'}) 
      }
 
    }else if(results.errorMessage){
      console.log('! results || results.errorMessage')
      if(method === 'login'){
        // res.cookie("TBlogin", 'false', { expire: new Date() +1000*60*60 });
        res.send({errorMessage:results.errorMessage||'Error loging in'})     
      }else if(method==='register'){
        if(results.errorMessage){
          res.send({errorMessage:results.errorMessage})
        }else{
          databaseFunctions.addUserToDatabase(userData)
            
        }
        }
    }

  })
  
 


})

app.get('/TBsesionInfo', function(req, res){
  //get all teamNames except for my own
  console.log('Req.sesssion!!!=======+++++')
  console.log(req.session)
  databaseFunctions.findAllInCollection('allTBusers', function(results){
    if(results.message!==undefined){
      console.log('What did we find for allTBusers? '+results.length)
      // var sessionInfo={}
      sessionInfo.allTBteamNames=[]
      var l = results.length
      for(var x=0;x<l;x++){
        sessionInfo.allTBteamNames.push(results[x].teamName)
      }
      sessionInfo.teamName = req.session.teamName
      console.log('Say my name '+sessionInfo.teamName)
      res.send(sessionInfo)
    }else{
      res.send('TODO something here')
    }
  })

})

app.get('/teamBallMatchup', function(req, res){
  console.log(req.session)
  console.log(req.session.cookie)
  res.cookies
  console.log('Teamball set up route')
  res.sendFile(__dirname+'/client/teamBall/views/matchup.html')

})
app.get('/logoutTB', function(req, res){
    req.session.destroy()
    res.cookie('TBlogin', false)
        // res.cookie("loggedIn", false, { expires: new Date() });
        // res.cookie("teamName", "undefined", { expires: new Date() });
        res.send('Good by')


})


app.use(express.static('client'));
app.use(favicon(__dirname + '/client/images/favicon.ico'));

// app.get('/', function(req, res){
//       var readStream = fs.createReadStream(app.get('clientDir')+'mygrid/myGridDocs.html');
//      //res.set({"Content-Disposition":"attachment; filename=//mygrid/myGridDocs.html"});
//      readStream.pipe(res);
// })
function loopObj(obj){
  console.log('got an object here '+obj)
  for (k in obj){
    if(typeof obj[k]==="object"){

      loopObj(obj[k])
    }else{
      console.log("Key: "+k+" and Value = "+obj[k])

    }
  }
}
app.get('/', function(req, res){
  if(req.cookies.teamballTeam){
    console.log('tes')
  }else{
    console.log('no')
  }
  console.log('connection IP address '+req.ip);
  res.cookie('loggedin','false')
  // console.log('Cookie : ')
  // loopObj(req.cookies)
  // console.log('----------------')
  // console.log('Session : ')
  // loopObj(req.session)
  var readStream = fs.createReadStream(app.get('clientDir')+'index/index.html');
     //res.set({"Content-Disposition":"attachment; filename=//mygrid/myGridDocs.html"});
     readStream.pipe(res);
  // res.send(req.ip)
})




app.post('/getIPdata', function(req, res){
  var id=req.body.id
  var asis=req.body.asis
  console.log('Got request for IP data')
  var dataObj={}
  var query = {'id':id,
             'asis':asis}
  databaseFunctions.FindInCollection('IPTraffic', query, function(resultObj){
    res.send(resultObj)
  })

  // databaseFunctions.FindInCollection('IPTraffic', {type:'transmit', 'asis':'IP'}, function(resultObj){
  //   console.log('transmit??')
  //   dataObj['transmit'] = resultObj
  //   databaseFunctions.FindInCollection('IPTraffic', {type:'receive', 'asis':'IP'}, function(resultObj){
  //     console.log('receive??')
  //     dataObj['receive'] = resultObj
  //     res.send(dataObj)

  //   })

  // })

})

app.post('/goright', function(req, res){
  console.log('were going right SERVO')
  http.get({
    hostname:"192.168.200.88",
    port:8266,
    path:'/g'
  }, function(resp){
    console.log('resp '+resp)
    res.send()
  })
})

app.post('/goleft', function(req, res){
  console.log('were going left SERVO')
  http.get({
    hostname:"192.168.200.88",
    port:8266,
    path:'/l'
  }, function(resp){
    console.log('resp '+resp)
    res.send('done')
  })
})

app.get('/meetapp', function(req, res){
  res.sendFile(__dirname+'/meetapp/meetapp.html')
})

app.get('/mygrid', function(req, res){
    var readStream = fs.createReadStream(app.get('clientDir')+'mygrid/myGridDocs.html');
     //res.set({"Content-Disposition":"attachment; filename=//mygrid/myGridDocs.html"});
     readStream.pipe(res);

})

app.get('users/:username/', function(req, res){
  var username = req.params.username;
      var readStream = fs.createReadStream(app.get('clientDir')+'users/'+username+'/index.html');
  
        if(!readStream){
          console.log(err+' no index.html in this users DIRRRRR')
        }else{
            readStream.pipe(res);            
          }
    
     //res.set({"Content-Disposition":"attachment; filename=//mygrid/myGridDocs.html"});

})

function resizeThisImage(image){
  console.log('Lets resize this image '+image);
  Jimp.read(image, function (err, lenna) {
    if (err) {
      console.log( err)
    
    }else{
          lenna.resize(256, 256)            // resize 
         .quality(60)                 // set JPEG quality 
         .greyscale()                 // set greyscale 
         .write(image+"-small-bw.jpg"); // save 
       }
});
}

app.get('/video', function(req, res){
    var readStream = fs.createReadStream(app.get('clientDir')+'webcamstream.html');
     // res.set({"Content-Disposition":"attachment; filename=//scrape/iframe.html"});
     readStream.pipe(res);
})

var STREAM_PORT = 9997
// HTTP Server to accept incomming MPEG Stream
var streamServer = require('http').createServer( function(request, response) {
  var params = request.url.substr(1).split('/');

  if( params[0] == 'badass' ) {
    response.connection.setTimeout(0);
    
    width = (params[1] || 320)|0;
    height = (params[2] || 240)|0;
    
    console.log(
      'Stream Connected: ' + request.socket.remoteAddress + 
      ':' + request.socket.remotePort + ' size: ' + width + 'x' + height
    );
    request.on('data', function(data){
      // console.log('data')
      wss.broadcast(data, {binary:true});

    });
  }
  else {
   console.log(
     'Failed Stream Connection: '+ request.socket.remoteAddress + 
     request.socket.remotePort + ' - wrong secret.'
   );
   response.end();
  }
}).listen(STREAM_PORT);


// app.get('/badass', function(req, res){
//   console.log(req)
//   req.on('data', function(data){
//     console.log('data emit steam server??')
//     // socketServer.emit(data, {binary:true});
//   });


// })

app.post('/uploads', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  if (app.get('username')=== null) {console.log('were going to get an error')};
  console.log(app.get('username')+ ' Username folder gogogog')
  if(!path.join(app.get('clientDir')+'users/'+app.get('username'))){
    console.log('THIS IS EXACTLY WHERE THE ERROR OCCURS< MAKR DIRRRR')
  }
  form.uploadDir = path.join(app.get('clientDir')+'users/'+app.get('username'));

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    console.log('field-'+field+' : file-'+JSON.stringify(file));
    var ext = file.name
    var index = ext.lastIndexOf('.')
    var ext = ext.slice(index)

    fs.rename(file.path, file.path+ext);
    resizeThisImage(file.path+ext)
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

app.post('/updateLocations', function(req, res){
  MongoClient.connect(url, function(err, db) {
    if (!err) {
  var ReqBody = req.body;
  var Length = ReqBody.length;
  var tempTimeArry = []
  var tempLatArry = []
  var tempLngArry = []
  for (var x = 0; x< Length; x++){
    console.log(ReqBody[x]);
    tempLngArry.push(ReqBody[x].lng)
    tempLatArry.push(ReqBody[x].lat)
    tempTimeArry.push(ReqBody[x].timestamp)

  
        var collection = db.collection('allusers');

    }
    collection.update({'username': ReqBody[0].username}, {$push:{'locations.lat': {$each: tempLatArry}}}, function(err, r){
      if(err){console.log('error updateing users location '+err)}
        else{'Ok no error updating user locations Array ' +r}
    })
    collection.update({'username': ReqBody[0].username}, {$push:{'locations.lng': {$each: tempLngArry}}}, function(err, r){
      if(err){console.log('error updateing users location '+err)}
        else{'Ok no error updating user locations Array ' +r}
    })
    collection.update({'username': ReqBody[0].username}, {$push:{'locations.time': {$each: tempTimeArry}}}, function(err, r){
      if(err){console.log('error updateing users location '+err)}
        else{'Ok no error updating user locations Array ' +r}
    })

  }else{
    console.log('Sorry there was an error accessing the DB '+err)
  }})

  res.end('you did it!!')
})

//badass video stream
// var videoStreamSocket = io.of('/badass').on('connection', function(socket){
//   console.log('/badass connection?  '+ socket.id)
//   socket.emit('videoStreamSocket', socket.id)
// })

// io.of('/video').on('connection', function(socket){

// })


  var width = 320,
    height = 240,
     STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

wss.on('connection', function(socket){
  // Send magic bytes and video size to the newly connected socket
  // struct { char magic[4]; unsigned short width, height;}
  var streamHeader = new Buffer(8);
  streamHeader.write(STREAM_MAGIC_BYTES);
  streamHeader.writeUInt16BE(width, 4);
  streamHeader.writeUInt16BE(height, 6);
  socket.send(streamHeader, {binary:true});

  console.log( 'New WebSocket Connection ('+wss.clients.length+' total)' );
  
  socket.on('close', function(code, message){
    console.log( 'Disconnected WebSocket ('+wss.clients.length+' total)' );
  });

})

wss.broadcast = function(data, opts) {
  for( var i in this.clients ) {
    if (this.clients[i].readyState == 1) {
      this.clients[i].send(data, opts);
    }
    else {
      console.log( 'Error: Client ('+i+') not connected.' );
    }
  }
};




var socketArray = []



 var meetapp = io.of('/meetapp').on('connection', function (socket) {
  console.log('MEETAPPERS!!!!')
  // console.log(socket)
  serverFunctions.socketCookieParser(socket, ' teamBallLogin')
// if (serverFunctions.socketCookieParser(socket, ' teamBallLogin')) {
//   console.log('this socket is logged in')
// }else{
//   console.log('needs to login i think')
//       fs.readFile(__dirname + "/client/teamBall/views/loginRegister.html", 'utf8', function(err, data){
//         if (err) {
//           console.log(err+' err getting teamball loginRegister.html')
//         }else {
//           console.log('Sending the teamball login')
//           socket.emit('loginRegister', data)
//         }
//       })

// }
  // serverFunctions.socketCookieParser(socket, 'teamname')
  // serverFunctions.socketCookieParser(socket, 'teamBallSessionID')
  // serverFunctions.setSocketCookie(socket, 'socket', 'socket')
	console.log('connection?? ')
  socketArray.push(socket)
  console.log('socketArray = '+socketArray.length+' added id = '+socket.id)

  //CONECTION
	fs.readFile(__dirname + "/client/views/login.html", 'utf8', function(err, data) {
	    if (err) {
	        console.log(err)
	    } else {
	        console.log('data sent in HTML for login.html')
	        socket.emit('connection', socket.id, data)
	    }
	})//CONECTION




	
  //teamBallPlease
  // socket.on('teamBallPlease', function(socketId){
  //   console.log(socket+ ' Requesting Teamball Index')
  //   fs.readFile(__dirname + "/client/teamBall/views/loginRegister.html", 'utf8', function(err, data){
  //     if (err) {
  //       console.log(err+' err getting teamball loginRegister.html')
  //     }else {
  //       console.log('Sending the teamball login back to '+socketId)
  //       socket.emit('loginRegister', data)
  //     }
  //   })
  // })  //teamBallPlease


//   function findInCollection(collectionName, key, value){
//  MongoClient.connect(url, function(err, db) {
//   if(!err){
//       console.log("We are connected to " + db.databaseName + ", poolSize = ")
//     var collection = db.collection(collectionName)
//         console.log('collection name ' + collection.s.name)
//   collection.find({key:value}).toArray(function(err, r){
//     if(err){
//       console.log('error finding '+key+" as "+value+" in collection "+collection)
//     }if(r.length ==0){
//       console.log('result length = '+r.length)
//       console.log('couldnt find it in '+collection.s.name+' as key:'+key+' and value:'+value)
//     }else{
//       console.log('found something in mongo for '+value)
//     }
//   })
// }else{
//   console.log('error connection to mongo')
// }
// })
// }
  socket.on('findTBuser', function(dataObject){
    var method = dataObject.method;
    var teamName = dataObject.username;
    var password = dataObject.password;
    if (teamName === '' || password === '') {
        socket.emit(method+'Error', "Please user your keyboard and type in your "+method+" info")
    }else{
      socket.emit(method+'Error', "Verifying....")
       console.log('I got a data object ')
    for (var k in dataObject){
      console.log(k +' : '+dataObject[k])
    }
 MongoClient.connect(url, function(err, db) {
  if(!err){
      var collection = db.collection('allTBusers');
      console.log("We are connected to " + db.databaseName + ", poolSize = ");
      console.log("teamName " + teamName + " : Password " + password)
      console.log('collection name ' + collection.s.name)
      collection.find({'teamName': teamName}).toArray(function(err, r) {
          if (err) {
              console.log("collection.find error ")
          } else if ((r.length !== 0) &&(method==='login')) {
            socket.emit(method+'Error', "verifying password")
            var userInfo = JSON.stringify(r[0])
              console.log('this is the rsult from finding the user ' + JSON.stringify(r[0]))
              console.log(r[0]['teamName'])
              console.log(r[0].password)
              if(password === r[0].password){
                socket.emit(method+'Error', "Logging in user")

                request.post('http://localhost:8080/teamballuserlogin',
                  {json:{'teamName':teamName} },
                  function(err, resp, body){
                    if(!err && resp.statusCode==200){
                      console.log('done posting allTBusers--------------------')
                    

                      fs.readFile(__dirname + "/client/teamBall/views/matchup.html", 'utf8', function(err, data) {
                          if (err) {
                              console.log(err)
                          } else {
                              console.log('html sent for /client/teamBall/views/matchup.html')
                              socket.emit('teamBallSetup',data)

                          }
                      })
                      // app.redirect('/teamBallSetup/')
                    }
                  }
                  )
              
              }else{
                socket.emit(method+'Error', "Wrong username/Password")

              }
            }else if((r.length !==0) && (method==='register')){
              console.log('this tean name is already exist')
              socket.emit(method+'Error', "this user is already exist")
            }else if ((r.length === 0) &&(method==='register')){
              socket.emit(method+'Error', "This user doesnt exist")
            }
          })




    // findInCollection('allTBusers', 'teamName', 'blur')
  }else{
    console.log('Error accesiong mongo DB for findTBuser')
  }
 })
  }




  })//findTBuser





socket.on('new', function(d, loggedInUserSocketid) {
	console.log('----------new-------------emited')
    var d = JSON.parse(d)
    console.log((d))
    var formData = (d)
    var username = d.username;
    var password = d.password
        //for(var k in d) console.log(k+"  :  "+d[k]+" Req.body from the form submit")
    if (username === '' || password === '') {
        socket.emit('loginError', "Please user your keyboard and type in your login info")

    } else {
        MongoClient.connect(url, function(err, db) {
            if (!err) {
            	app.set('username', username)
                var collection = db.collection('allusers');
                console.log("We are connected to " + db.databaseName + ", poolSize = ");
                console.log("username " + username + " : Password " + password)
                console.log('collection name ' + collection.s.name)
                collection.find({
                    'username': username
                }).toArray(function(err, r) {
                    if (err) {
                        console.log("collection.find error ")
                    } else if (r.length !== 0) {
                    	var userInfo = JSON.stringify(r[0])
                        console.log('this is the rsult from finding the user ' + JSON.stringify(r[0]))
                        console.log(r[0]['username'])
                        console.log(r[0].password)
                        var sock = r[0].socketId
                        console.log(sock+' The result from Mongo')
                        console.log(loggedInUserSocketid+' result passed form the new emit ');;
                        sock = sock.split('').splice(-5).join('')

                        if (r[0].password === password) {

                          fs.stat(app.get('clientDir')+'users/'+username, function(err, stat){
                            if (err) {
                              console.log(err+' error accessing '+username+'`s Directory. So lets create it')
                              fs.mkdir(app.get('clientDir')+'users/'+username, function(err){if(err)console.log(err+' error creating the users directory')})
                            }
                              else{console.log('THIS USER IS READY TO UPLOAD FILES!!!');};
                          })

                         
                            console.log('Lets login this returning user ' + r[0].username)
                            fs.readFile(__dirname + "/client/views/dashBoard.html", 'utf8', function(err, data) {
                                if (err) {
                                    console.log(err)
                                } else {
                                  
                                    socket.emit('newUserRegister', userInfo,data)
                                    collection.update(
                                      {'username':username},
                                      {$set:
                                        {
                                          'loginDate': new Date(),
                                          'loggedIn': true,
                                          'socketId': socket.id
                                        }}, function(err, r){
                                          if(err){
                                            console.log('error! updating users logging in '+err)
                                          }else{
                                            console.log('update and set the user login info : returned '+r)
                                          }
                                        })
                                    socket.broadcast.emit('userLogin', sock, socket.id )
                                      console.log('sock is the old, socket.id is new')

                                     
                                
                                  }
                          })

                        } else {
                            console.log('Username and Password do not match')
                            socket.emit('loginError', 'Username and Password do not match')
                        }

                    } else {
                        console.log('no  results,  : ' + (r.length))
                        console.log("r does not exist, must be a new user" + r)
                        var insertData = {
                            'username': username,
                            'password': password,
                            'registrationDate': new Date(),
                            'loggedIn': true,
                            'socketId': socket.id,
                            'locations':{
                              'lat':[],
                              'lng':[],
                              'time':[]
                            }

                        }
                        fs.mkdir(app.get('clientDir')+'users/'+username, function(err){
                        										console.log(err)
                        										fs.readdir(app.get('clientDir')+'users/'+username, function(err, stats){
                        											if (err) {console.log(err)}
                        												else{console.log("stats go here "+stats)}
                        										})
                        									})//mkDir new user
                        fs.readFile(__dirname + "/client/views/dashBoard.html", 'utf8', function(err, data) {
                            if (err) {
                                console.log(err)
                            } else {
                                // console.log('data sent in HTML for file uploading')
                                collection.insert(insertData)
                                socket.emit('newUserRegister', insertData, data)
                                socket.broadcast.emit('userLogin', sock, socket.id, username )

                            }
                        })//reafFile dashboard.html and send it to new user

                    }//no find.r- create user
                })//mongo.find().toArray()r
            } else {
                socket.emit('loginError', 'failed to connect to the DB')
            }//db connect error or not
        });//mongo client connect
    }//username and pasword are not blank strings
})//socket emit 'new'





socket.on('dashboardReady', function(d){
  console.log("DASHBOARD IS READY "+d)
  //send the chat data and users online
  MongoClient.connect(url, function(err, db){
    if(err){console.log('error connection to DB '+err)}
      else{
        var messageArray = []
        var allMessages = db.collection('allmessages');
        var allusers = db.collection('allusers');

        allMessages.find().count(function(err, count){
          if(!err && count<20){
              allMessages.find().skip(count-20).toArray(function(err, item){
                if(err){console.log('error finding messages '+err)}
                else{
                  for(var k in item){
                    messageArray.push(item[k])
               // console.log('This is the interation of k in items '+k+' : '+item[k])
                   }
                if(messageArray.length===item.length){
                socket.emit('masterChat', messageArray)
                console.log('SEND THE MASTER MESSAGE!!!!!!')
              }
            }
        })//allmessages find limit 20




  }else{
    allMessages.find().toArray(function(err, item){
          if(err){console.log('error finding messages '+err)}
          else{
            for(var k in item){
              messageArray.push(item[k])
         // console.log('This is the interation of k in items '+k+' : '+item[k])
             }
          if(messageArray.length===item.length){
          socket.emit('masterChat', messageArray)
          console.log('SEND THE MASTER MESSAGE!!!!!!')
        }
      }
    })
  }
})//allMessages.find()



        // var userArray = [];
        // allusers.find({}).toArray(function(err, item){
        //   if(err){console.log('error finding users '+err)}
        //     else{
        //       console.log(item[item.length])
        //       for(var x = 0; x< item.length;x++)
        //         {userArray.push(item[x])}
        //       if(userArray.length == item.length){
        //         console.log('users Array is full')
        //         socket.emit('usersListData', userArray)
        //       }

        //     }
        // })
      }//mongo db was successful

  })//mongo.Connect
	console.log('got an admin  connection with the ID '+d)
	console.log('admin connected event + username: '+app.get('username'))
	socket.emit('loginInfo', { 
                username:app.get('username'),
								socketid : d,
								totalMemory: OS.totalmem,
								freeMemory: OS.freemem(),
								HomeDir : OS.homedir(),
								HostName: OS.hostname(),
								NetWork : OS.networkInterfaces(),
								Platform: OS.platform(),
								OS_type: OS.type(),
								uptime: OS.uptime(),
								//userInfo: OS.userInfo({'encoding':'utf8'}),
								path : app.get('clientDir')+app.get('username'),
								link : 	'<a class="btn btn-info" href="/users/'+app.get("username")+'">Your link</a>'
								// '<a href="localhost:8081/"'+app.get('username')+'></a>'
								// <a href="">link</a>
	 })//emit login info
	
})//Emit DashboardReady



socket.on('showMeTheFiles', function(username){
  // fs.watch(__dirname+'/client/users/'+username, function(end, filename){
  //   console.log(filename+' changed in '+__dirname+'/client/users/'+username);
  //   // this.close()
  // })

  console.log(username+' wants to see thier files');
  fs.readFile(__dirname + "/client/views/dashboard/myFiles.html", 'utf8', function(err, data) {
      if (err) {
          console.log(err)
      } else {
          console.log('File list sent in HTML for dashBoard/myFiles.html')
          socket.emit('hereMyFilesHTML',data)

      }
  })
})


socket.on('getUserFiles', function(username){
  console.log(username+' getUserFiles was emited, lets access that folder');
  fs.readdir(__dirname+'/client/users/'+username, function(err, files){
    if(err){
      if(err.code = "ENOENT"){
        fs.mkdir(app.get('clientDir')+'users/'+username, function(err){if(err)console.log(err+' error creating the users directory')})
        console.log('This needs to be fixed')
      }
      console.log('error: '+err.code+'; while accessing the folder '+__dirname+'/client/users/'+username+' for '+username);
    }else{
      console.log(files)
      // var dir = __dirname+'/client/users/'+username
      socket.emit('hereListMyFileArray', files, username)
    }

  })



})
var primitiveStateChecker = true;
var primitiveQueueArray = [];

socket.on('LetsRunThatPrimitiveProgram', function(fileName, username){
  runPrimitiveInChildProcess(fileName, username)
})

function runPrimitiveInChildProcess(fileName, username){
 console.log('primitive was clicked, whats the state??');
        
     if (primitiveStateChecker === true) {
      console.log('State is true, lets primify this pic');
           var exec = require('child_process').exec
     // var spawn = require('child_process').spawn;
     var grep = exec('grep', ['ssh']);
     console.log(primitiveStateChecker +' '+grep.pid);
           primitiveStateChecker = false
        console.log('Primitive photo action was emited for the file '+__dirname+'/client/'+username+'/'+fileName);
     // counterHere = false
        //var PRIMITIVE = 
       var primExec = exec('primitive -i '+__dirname+'/client/users/'+username+'/'+fileName+' -o '+__dirname+'/client/users/'+username+'/P-'+fileName+' -n 50 -v')
       primExec.stdout.on('data', function(stdout){
  
                 var perc = stdout.split(' ')
                 if(perc[0].split('').length > 8){
                  perc = perc[1]
                 }else{
                  perc = perc[0]

                 }
                 perc = perc.split('')
                 perc.pop()
                 perc = perc.join('')
                 console.log(perc/50*100+'%');
                 socket.emit('primitivePercentDone', Math.round(perc/50*100))
                 // console.log('Precentage: '++'%');
                 
               })
       primExec.on('exit', function(code){
        socket.emit('PrimitivePhotoIsDone',  __dirname+'/client/users/'+username+'/P-'+fileName)
                 primitiveStateChecker = true
                 if(primitiveQueueArray.length > 0){
                   var nextInLine = primitiveQueueArray.shift()
                   runPrimitiveInChildProcess(nextInLine['file'], nextInLine['user'])
                 }
        console.log('exit with code '+code);
       })
             //})//exec callback
             }else{
              console.log('THE STATE IS FALSE, we do nothing, sorry caps');
              primitiveQueueArray.push({file: fileName, user:username})
              console.log(primitiveQueueArray);
             }
}//runPrimitiveChildProcess


socket.on('letsRenameThisFile', function(before, after, username){
  console.log('Filename: '+before+' changed to '+after+' username '+username);
  var point = before.lastIndexOf('.')
var fileEXT = before.slice(point).toLowerCase()
fs.rename(app.get('clientDir')+'users/'+username+'/'+before, app.get('clientDir')+'users/'+username+'/'+after+fileEXT, function(err){
  if(err){
    console.log(err);
  }else{
    console.log('file was renamed '+app.get('clientDir')+'users/'+username+'/'+after+fileEXT);
  }
} )

})


socket.on('UserWantsToDeleteFile', function(filename, username){
  // console.log('File: '+filename+' and username is:  '+username);
  var someKindOfValidation = true
  if(someKindOfValidation){
    console.log('Going to Delete file: '+filename+' from folder '+app.get('clientDir')+'users/'+username);
    fs.unlink(app.get('clientDir')+'users/'+username+'/'+filename, function(err) {
   if (err) {
      return console.error(err);
   }
   console.log("File deleted successfully!");
});
  }
})




socket.on('getMap', function(){
	console.log('WE NEED TO GET THE MAP FORM THE FILE YO!');
	fs.readFile(__dirname + "/client/views/dashboard/map.html", 'utf8', function(err, data) {
	    if (err) {
	        console.log(err)
	    } else {
	        console.log('data sent in HTML for dashBoard/map.html')
	        socket.emit('hereMapHTML',data)
	    }
	})
})

socket.on('GetBlocksHTML', function(){
  console.log('WE NEED TO GET THE BLOCKS HTML!');
  fs.readFile(__dirname + "/client/views/blocks/blocks.html", 'utf8', function(err, data) {
      if (err) {
          console.log(err)
      } else {
          console.log('data sent in HTML for blocks/blocks.html')
          socket.emit('hereBlocksHTML',data)
      }
  })
})

socket.on('blockClick', function(data){
  console.log(data.id+" : "+data.top+" top "+data.left+" left")
  io.sockets.emit('blockMove', data)
})


socket.on('weGotSomePositionToShare', function(data){
  console.log(data)

  socket.broadcast.emit('allFriendsGPSPosition', data)
})

socket.on('someUSerStoppedGPSTracking', function(data){
  console.log(data)
})

socket.on('chatInput', function(d){
  console.log('got some chat input here from '+d.sender)
  console.log(d)
  console.log("my d.time is "+d.time)
  var newTime = new Date(d.time)
  var day = newTime.getDate()
  var month = newTime.getMonth()+1
  var hours = function(){
    if(newTime.getHours()>12){
      return newTime.getHours()-12
    }else{
      return newTime.getHours()
    }
  }
  var AmPm = function(){
    if (newTime.getHours() > 11){
      return 'PM'
    }else{
      return 'AM'
    }
  }
  var minutes = newTime.getMinutes()
  var seconds = newTime.getSeconds()
  var year = newTime.getYear()-100
  console.log('the date is '+month+"/"+day+"/"+year+" @ "+hours()+":"+seconds+" "+AmPm())
  var timeStamp = month+"/"+day+"/"+year+" @ "+hours()+":"+seconds+" "+AmPm()
  MongoClient.connect(url, function(err, db) {
      if (!err) {
          var collection = db.collection('allmessages');
          console.log('were in the mongoDB!')
          collection.insert(d, function(err, result){
            if(err){
              console.log('Error message! '+err)
            }else{
              console.log('message was inserted to the DB '+result)
              io.emit('chatEvent', d)
              for(var k in result){
                console.log(k+'  :  '+result[k])
              }
            }
          })
        }else{
          console.log('Error connecting to Mongo '+err)
        }
  })
})



socket.on('stocksHTMLrequest', function(d){
  console.log(d.time)
      fs.readFile(__dirname + "/client/views/stocks/commodities.html", 'utf8', function(err, data) {
        if(err){console.log(err)}
          else{
            socket.emit('stocksHTMLdata', data)
          }
      })
})




socket.on('disconnect', function(){
  var indexOfDisconectedSocket = socketArray.indexOf(socket)
  if(indexOfDisconectedSocket >-1){
    console.log('remove this socket '+socket.id+' from socketArray')
    socketArray.splice(indexOfDisconectedSocket,1)
  }else{
    console.log('this socket is lost...? '+socket.id)
  }
  console.log('disconnection! '+socket.id)
  io.sockets.emit('userDisconnected', socket.id)
  MongoClient.connect(url, function(err, db){
    if(err){console.log(err+' while diconnecting')}
      else{
        db.collection('allusers').update({
          'socketId':socket.id}, {$set: { loggedIn: false,
                                        logoutDate : new Date() }
                                      }, function(e, r){
                                        if(e){console.log(e)}
                                          else{console.log('user loged out and DM was updated')}
                    
                                      })
      }

  })
})

socket.on('error', function(err){
  console.log('We have an error somehwere '+err);
})


})//MASTER IO SOCKET



app.get('/downloadhtmlfile',function(req,res){
	var readStream = fs.createReadStream(app.get('clientDir')+'scrape/iframe.html');
   res.set({"Content-Disposition":"attachment; filename=//scrape/iframe.html"});
   readStream.pipe(res);
});




if (DEVELOPMENT===true) {
//FOR DEV USE
var port = 8080
server.listen( port, function () {

console.log('lisenign on port '+port+' Development')
//  // for (var k in process){console.log(k +"  :  "+process[k])}
})
};

if (PRODUCTION===true) {
  serverRD.listen(HTTP_PORT)
// var port = 443



//FOR PRODUCTION
httpsServer.listen( HTTPS_PORT, function () {

console.log('lisenign on port '+HTTP_PORT+' and on Redirrect port '+HTTPS_PORT)
 // for (var k in process){console.log(k +"  :  "+process[k])}
})

};



