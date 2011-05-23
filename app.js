var express = require('express')
  , fs = require('fs');

  var debug = true
    , fileHasBeenModified = true
    , ticklist
    , tick = module.exports = express.createServer();

// Configuration
tick.configure(function(){
  tick.set('views', __dirname + '/views');
  tick.set('view engine', 'ejs');
  tick.use(express.bodyParser());
  tick.use(express.methodOverride());
  tick.use(require('stylus').middleware({ src: __dirname + '/public' }));
  tick.use(tick.router);
  tick.use(express.static(__dirname + '/public'));
  tick.use(express.favicon(__dirname + '/public/favicon.ico'))  
  tick.set('view options', { layout: false });
});

tick.configure('development', function(){
  tick.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

tick.configure('production', function(){
  tick.use(express.errorHandler()); 
});

// Routes
tick.get('/', function(req, res) {
  // Check timestamp to see if we need to reopen file.
  if(fileHasBeenModified) {
    ticklist = JSON.parse(getDataFromFile('ticklist.json'));
  }
  res.render('index.ejs', {
    list: ticklist
  });
});
 
tick.post('/save', function(req, res){
  // Write to file.
  //console.log(sys.inspect(req.headers))
  //console.log(sys.inspect(req.body))
  
  var postList = req.body;
  //console.log(postList);
  
  writeToFile('ticklist.json', postList);
  
  var jsun = {
    "message" : "Ticks saved.",
    "code" : 200
  };
	res.contentType('application/json');
	res.send(JSON.stringify(jsun), 200);

});


// Methods
function watchFile(filename){
  fs.watchFile(__dirname + '/public/' + filename, function (curr, prev) {

    fileHasBeenModified = (curr.mtime > prev.mtime);
    
    console.log("Has the file been modified: " + fileHasBeenModified);
    // console.log('the current mtime is: ' + curr.mtime);
    // console.log('the previous mtime was: ' + prev.mtime);
  });
}

function getDataFromFile(filename) {
  return fs.readFileSync(__dirname + "/public/" + filename, 'utf8')
}

function writeToFile(filename, data) {
  fs.writeFileSync(__dirname + "/public/" + filename, JSON.stringify(data), 'utf8')
}

// Only listen on $ node app.js

var app = express.createServer();
app.use(express.vhost('dev', tick));

if (!module.parent) {
  app.listen(3300);
  watchFile('ticklist.json');
  console.log("Express server listening on port %d", app.address().port);
}