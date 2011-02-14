require.paths.unshift(__dirname + '/lib')
var port = 8888;
var net = require('net');
var sys = require('sys');
var express = require('express');
var con = require('connection');
var app = express.createServer(
    express.logger()
);

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.post('/connection', function(req, res){
  res.send("/connection/"+ con.create());
});

app.get("/connection/:id", function(req, res) {
  con.flush(req.params.id, res);
});

app.put("/connection/:id", function(req, res) {
  con.process_command(req.params.id, req.query.cmd);
  res.send("ok");
});

app.configure(function(){
    app.use(express.bodyDecoder());
    app.use(express.staticProvider(__dirname + '/public'));
    app.set('views', __dirname + '/views');
});

app.listen(port);

