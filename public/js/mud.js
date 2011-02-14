$(function() {
  $("#screen").height(500);
  $("#terminal").width(800);
  $("#cursor").width(500);

  $("#cursor").focus();
  $("#terminal").click(function() { $("#cursor").focus() });

  var KEY_ENTER = 13;
  var ROWS = 15;
  var Buffer = [ ];
  var Queue = [ ];

  var render = function() {
    $("#screen").html(Buffer.join("\n"));
  }

  var puts = function(data) {
    data.trim().split("\n").forEach(function(line) {
      Queue.push(line);
    })
    flush();
  }

  var flushTimer;

  var flush = function() {
    for(var i = 0; i < 10 && Queue.length > 0; i++) {
      Buffer.push(Queue.shift());
      if (Buffer.length > ROWS) Buffer.shift();
      render();
    }
    if (!flushTimer)
      flushTimer = setTimeout(function() {
        flushTimer = undefined;
        flush();
      }, 100)
  };

  $("#cursor").keypress( function(e) {
    if (e.which == KEY_ENTER) {
      var cmd = $("#cursor").val().trim();
      $("#cursor").val('');
      $.ajax( { type: 'PUT', url: Channel + "?cmd=" + cmd, error: function(jx,s,e) { puts("ERROR: " + s + "::" + e); } });
      // returning false here will prevent the textbox from getting the enter key
      return false;
    }
  });

  var connection_ok = false;
  var fetch = function() {
    $.ajax({
      type: 'GET',
      url: Channel,
      success: function(data)
      {
        connection_ok = true;
        puts(data)
        fetch();
      },
      error: function(jx,s,e)
      {
        if (connection_ok) puts("ERROR: " + s + "::" + e);
        connection_ok = false;
        setTimeout(fetch, 2000);
      }
    });
  }

  $.post("/connection/", function(data) {
    Channel = data;
    fetch();
  });

});
