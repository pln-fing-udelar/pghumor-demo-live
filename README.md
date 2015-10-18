# Prueba de concepto

## Configurar usuario de la base

Crear el archivo `config/secrets.yml` con el contenido:

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

Reemplazar por la contraseña del usuario de la base de datos que use y por las credenciales de la API de Twitter.

Para generar los valores de `secret_key_base` en `development` y `test`, ejecutar:

```bash
bundle exec rake secret
```

Autorizar usuario `pghumor` a la base:

```sql
GRANT ALL PRIVILEGES ON prueba_concepto_development.* TO 'pghumor'@'%' WITH GRANT OPTION;
```

## Agarrar cambios mientras se deja corriendo el server

```bash
bundle exec rerun "bundle exec rails server"
```

## Correr el demonio de Twitter Streaming

```bash
bundle exec rails runner lib/daemon/twitter_daemon.rb start
```
