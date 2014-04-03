require 'sinatra'
require 'sinatra/static_assets'

get '/' do
  erb :index
end

get '/api/data' do
  content_type :json
  File.read('data/data.json')
end