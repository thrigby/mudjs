require 'sinatra/base'
require 'sinatra/async'

require 'lib/connection'

class MudServer < Sinatra::Base
  register Sinatra::Async
  set :public, File.dirname(__FILE__) + '/public'

  enable :show_exceptions
  enable :logging

  def initialize
    @connection = Connection.new
    super
  end

  get "/" do
    erb :index
  end

  post "/connection/" do 
    "/connection/#{@connection.create}"
  end

  aget "/connection/:id" do  |id|
    @connection.flush(id) do |message|
      body message
    end
  end

  put "/connection/:id" do |id|
    @connection.process_command(id, params[:cmd]);
    "ok"
  end
end

