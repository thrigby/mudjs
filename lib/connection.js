var sys = require("sys");
var Index = 0;
var CH = {};
var Waiting = {};
var Player = require("player");

var write = function(con, msg) {
  if (Waiting[con])
  {
    Waiting[con].send(msg);
    delete Waiting[con];
  }
  else
  {
    if (!CH[con]) CH[con] = [];
    CH[con].push(msg);
  }
}

Player.init(write);

exports.create = function() {
  CH[++Index] = [
    "Welcome to Baby Seal Node MUD.",
    "Make sure to bring a towel...",
    "type 'help' to begin!"
  ];
  return Index;
}

exports.process_command = function(con, msg) {
  var match = msg.trim().match(/^(\S+) *(.*)/);
  var cmd = match[1].toLowerCase();
  var arg = match[2].trim();
  if (arg.length > 0)
    Player.find(con).process_command(cmd, arg);
  else
    Player.find(con).process_command(cmd);
}

exports.flush = function(con, res) {
  if (CH[con] && CH[con].length > 0)
  {
    res.send(CH[con].join("\n"));
    CH[con] = [];
  }
  else
  {
    if (Waiting[con]) Waiting[con].end();
    Waiting[con] = res;
    CH[con] = [];
  }
}

