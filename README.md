# Prueba de concepto

## Configurar usuario de la base

Autorizar usuario pghumor a la base:

```sql
GRANT ALL PRIVILEGES ON prueba_concepto_development.* TO 'pghumor'@'%' WITH GRANT OPTION;
```

## Agarrar cambios mientras se deja corriendo el server

```bash
bundle exec rerun "bundle exec rails server"
```
