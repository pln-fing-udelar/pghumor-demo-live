# Prueba de concepto

## Configurar usuario de la base

Crear el archivo `config/secrets.yml` con el contenido (reemplazando por la contraseña del usuario de la base de datos):

```yml
development:
  password: --PASSWORD--

test:
  password: --PASSWORD--

production:
  password: --PASSWORD--
```

Autorizar usuario pghumor a la base:

```sql
GRANT ALL PRIVILEGES ON prueba_concepto_development.* TO 'pghumor'@'%' WITH GRANT OPTION;
```

## Agarrar cambios mientras se deja corriendo el server

```bash
bundle exec rerun "bundle exec rails server"
```
