var Players = {}
var write;

var Player = {
  name: "Someone",
  process_command: function(cmd, arg)
  {
    switch (cmd)
    {
      case "look":
        this.do_look(arg);
        break;
      case "help":
        this.do_help(arg);
        break;
      case "name":
        this.do_name(arg);
        break;
      case "say":
        this.do_say(arg);
        break;
      default:
        write(this.con, "Unknown command '" + cmd + "'.");
    }
  },
  act: function(msg1, msg2)
  {
    for (var c in Players)
    {
      if (c == this.con)
        if (msg1) write(c, msg1);
      else
        if (msg2) write(c, msg2);
    }
  },
  others_in_room: function()
  {
    var o = []
    for (var i in Players)
    {
      if (i != this.con)
        o.push(Players[i])
    }
  },
  do_help: function(msg)
  {
    this.act("Commands: help, look, say, name");
  },
  do_look: function(msg)
  {
    this.act("The Arctic");
    this.act("    It is cold here");
    this.act("[------]");
    for (var o in this.others_in_room())
    {
      this.act("You see " + o.name);
    }
  },
  do_say: function(msg)
  {
    this.act("You say '" + msg + "'.",
             this.name + " says '" + msg + "'.");
  },
  do_name: function(arg)
  {
    if (arg)
    {
      this.name = arg;
      this.act("Your new name is " + arg);
    }
    else
      this.act("Your name is " + this.name);
  }
}

exports.init = function(w) {
  write = w;
}

exports.find = function(con) {
  if (!Players[con])
  {
    Players[con]      = Object.create(Player);
    Players[con].name = "Player#" + con;
    Players[con].con  = con;
  }
  return Players[con]
}
