require 'tweetstream'
require 'yaml'

APP_CONFIG = Rails.application.secrets

TweetStream.configure do |config|
  config.consumer_key = APP_CONFIG['twitter_streaming']['consumer_key']
  config.consumer_secret = APP_CONFIG['twitter_streaming']['consumer_secret']
  config.oauth_token = APP_CONFIG['twitter_streaming']['oauth_token']
  config.oauth_token_secret = APP_CONFIG['twitter_streaming']['oauth_token_secret']
  config.auth_method = :oauth
end

TERMINOS = [
    'Boca',
]

TweetStream::Daemon.new('tracker', log_output: true, log_dir: File.join(Dir.pwd, 'log'), dir: File.join(Dir.pwd, 'tmp/pids')).on_error do |message|
  puts "[ERROR] #{message}"
end.on_unauthorized do
  puts '[ERROR] Unauthorized'
end.on_reconnect do |timeout, retries|
  puts "[WARNING] Reconnection number #{retries}, with timeout #{timeout}"
end.on_delete do |status_id, user_id|
  puts "[INFO] Request for deletion the tweet with status id #{status_id} and user id #{user_id}"
end.on_limit do |skip_count|
  puts "[WARNING] Due to limits, #{skip_count} tweets were skipped"
end.on_enhance_your_calm do
  puts '[ERROR] Enhance your calm'
end.track(TERMINOS) do |status|
  puts status.text
end
