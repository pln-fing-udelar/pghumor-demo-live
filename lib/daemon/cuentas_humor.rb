def obtener_cuentas_humor app_config
  client = Twitter::REST::Client.new do |config|
    config.consumer_key = app_config['twitter_streaming']['consumer_key']
    config.consumer_secret = app_config['twitter_streaming']['consumer_secret']
    config.access_token = app_config['twitter_streaming']['oauth_token']
    config.access_token_secret = app_config['twitter_streaming']['oauth_token_secret']
  end

  client.user_search('chiste')
end
