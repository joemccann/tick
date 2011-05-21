var express = require('express')
  , fs = require('fs')
  , sys = require('util')

var app = express.createServer();

  var debug = true
    , fileHasBeenModified = true
    , ticklist
    , app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  // Check timestamp to see if we need to reopen file.
  if(fileHasBeenModified)
  {
    ticklist = JSON.parse( getDataFromFile('ticklist.json') ) 
  }
  res.render('index.ejs', {
    title: 'Tick',
    list: ticklist
  });
  
});
 
app.post('/save', function(req, res){
  // Write to file.
  //console.log(sys.inspect(req.headers))
  //console.log(sys.inspect(req.body))
  
  var postList = req.body;
  console.log(postList)
  
  writeToFile('ticklist.json', postList);
  
  var jsun = {};
	jsun.message = "Ticks saved."
	jsun.code = 200;
	res.contentType('application/json');
	res.send(JSON.stringify(jsun), 200);

});


// Methods

function watchFile(filename){
  fs.watchFile(__dirname + '/public/' + filename, function (curr, prev) {

    fileHasBeenModified = (curr.mtime > prev.mtime) ? true : false;
    
    console.log("Has the file been modified: " + fileHasBeenModified)
    // console.log('the current mtime is: ' + curr.mtime);
    // console.log('the previous mtime was: ' + prev.mtime);
  });
}

var deleteme = {"items":[{"task": "Bathe Mack.", "urgent": false},{"task": "Finish RFPs.", "urgent": true}]}


function getDataFromFile(filename){
  return fs.readFileSync(__dirname + "/public/" + filename, 'utf8')
}

function writeToFile(filename, data)
{
  fs.writeFileSync(__dirname + "/public/" + filename, JSON.stringify(data), 'utf8')
}

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3300);
  watchFile('ticklist.json')
  console.log("Express server listening on port %d", app.address().port);
}
