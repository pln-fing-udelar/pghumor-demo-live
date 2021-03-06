require 'rx'
require 'tweetstream'
require 'yaml'

require_relative 'clasificador'
require_relative 'cuentas_humor'
require_relative 'observable_sized_priority_queue'

def status_to_tweet status
  tweet = Tweet.new
  tweet.id_tweet = status.id
  tweet.text = status.text
  tweet.retweet_count = status.retweet_count
  tweet.favorite_count = status.favorite_count
  account = Account.where(name: status.user.screen_name).first
  if account.nil?
    account = Account.new
    account.name = status.user.screen_name
    account.description = status.user.description
    account.image_path = status.user.profile_image_url_https
  end
  tweet.account = account
  tweet
end

CLASIFICADOR = Clasificador.new

COLA = ObservableSizedPriorityQueue.new 100

SUSCRIPTOR = RX::Observer.create(
    lambda { |tweet|
      es_humor = CLASIFICADOR.es_humor?(tweet)
      puts tweet.text
      puts "Es humor: #{es_humor}"

      if es_humor
        tweet.save
      end

      COLA.pop.subscribe(SUSCRIPTOR)
    },
    lambda { |err|
      puts 'Error: ' + err.to_s
      COLA.pop.subscribe(SUSCRIPTOR) # Not working
    },
    lambda {
      puts 'Completed'
      COLA.pop.subscribe(SUSCRIPTOR) # Not working
    }
)

COLA.pop.subscribe(SUSCRIPTOR)

APP_CONFIG = Rails.application.secrets

TweetStream.configure do |config|
  config.consumer_key = APP_CONFIG['twitter_streaming']['consumer_key']
  config.consumer_secret = APP_CONFIG['twitter_streaming']['consumer_secret']
  config.oauth_token = APP_CONFIG['twitter_streaming']['oauth_token']
  config.oauth_token_secret = APP_CONFIG['twitter_streaming']['oauth_token_secret']
  config.auth_method = :oauth
end

CUENTAS = obtener_cuentas_humor(APP_CONFIG).map { |user| user.id }

TERMINOS = [
    '#chiste',
    Tweet::HASHTAG_IDM,
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
  puts "[WARNING] Due to limits, #{skip_count} tweets have been skipped"
end.on_enhance_your_calm do
  puts '[ERROR] Enhance your calm'
end.filter({ :follow => CUENTAS, :track => TERMINOS }) do |status|
  tweet = status_to_tweet(status)
  COLA << tweet
end
