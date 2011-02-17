class Connection

  def initialize
    @id = 0;
    @cons = Hash.new []
    @waiting = {}
  end

  def create
    @id += 1
    @cons["#{@id}"] = [
      "Welcome to Baby Seal Node MUD.",
      "Make sure to bring a towel...",
      "type 'help' to begin!"
    ];
    @id
  end

  def flush(con, &blk)
    if (@cons[con].length > 0)
      blk.call(@cons[con].join("\n"));
      @cons[con] = [];
    else
      @waiting[con].call("") if @waiting[con]
      @waiting[con] = blk;
      @cons[con] = [];
    end
  end

  def write(con, msg)
    if (@waiting[con])
      @waiting[con].call(msg);
      @waiting.delete(con);
    else
      @cons[con] << msg;
    end
  end

  def process_command(con, cmd)
    ## add code here to parse the command and pass to the mud engine
    ## currently just echo back to the user
    write con, "ECHO: #{cmd}"
  end
end

