# Humor detection with Twitter Streaming

## Set up the database user

Create the file `config/secrets.yml` with the content:

```yml
development:
  password: --PASSWORD--
  secret_key_base: --SECRET_KEY_BASE--
  twitter_streaming:
    consumer_key: --TWITTER_STREAMING_CONSUMER_KEY--
    consumer_secret: --TWITTER_STREAMING_CONSUMER_SECRET--
    oauth_token: --TWITTER_STREAMING_OAUTH_TOKEN--
    oauth_token_secret: --TWITTER_STREAMING_OAUTH_TOKEN_SECRET--

test:
  password: --PASSWORD--
  secret_key_base: --SECRET_KEY_BASE--
  twitter_streaming:
    consumer_key: --TWITTER_STREAMING_CONSUMER_KEY--
    consumer_secret: --TWITTER_STREAMING_CONSUMER_SECRET--
    oauth_token: --TWITTER_STREAMING_OAUTH_TOKEN--
    oauth_token_secret: --TWITTER_STREAMING_OAUTH_TOKEN_SECRET--

production:
  password: <%= ENV["PASSWORD"] %>
  secret_key_base: <%= ENV["SECRET_KEY_BASE"] %>
  twitter_streaming:
    consumer_key: <%= ENV["TWITTER_STREAMING_CONSUMER_KEY"] %>
    consumer_secret: <%= ENV["TWITTER_STREAMING_CONSUMER_SECRET"] %>
    oauth_token: <%= ENV["TWITTER_STREAMING_OAUTH_TOKEN"] %>
    oauth_token_secret: <%= ENV["TWITTER_STREAMING_OAUTH_TOKEN_SECRET"] %>
```

Replace with the password of the user of the used database and with the Twitter API credentials.

To generate the values of `secret_key_base` in `development` and `test`, run:

```bash
bundle exec rake secret
```

Grant access to `pghumor` to the database:

```sql
GRANT ALL PRIVILEGES ON prueba_concepto_development.* TO 'pghumor'@'%' WITH GRANT OPTION;
```

## Catch changes while running the server

```bash
bundle exec rerun "bundle exec rails server"
```

## Run the Twitter Streaming daemon

```bash
bundle exec rails runner lib/daemon/twitter_daemon.rb start
```
