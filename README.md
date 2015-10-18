# Prueba de concepto

## Configurar usuario de la base

Crear el archivo `config/secrets.yml` con el contenido (reemplazando por la contraseña del usuario de la base de datos):

```yml
development:
  password: --PASSWORD--
  secret_key_base: --SECRET_KEY_BASE--

test:
  password: --PASSWORD--
  secret_key_base: --SECRET_KEY_BASE--

production:
  password: <%= ENV["PASSWORD"] %>
  secret_key_base: <%= ENV["SECRET_KEY_BASE"] %>
```

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
