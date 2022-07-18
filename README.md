# Calendario de tareas (Front-End)
Para correr localmente el proyecto se necesita la conexión con el backend.

## El primer paso es configurar las variables de entorno
Se debe renombrar el archivo __.env.template__ a __.env__
URL de la API local:
```
REACT_APP_API_URL=http://localhost:4000/api
```
En este caso la api se encontraría corriendo localmente en el puerto 4000 y se accederían a todos los endpoints a través de __/api/*__.

## Después solo queda reconstruir los módulos de node
```
npm install
npm run dev
```

## Levantar la aplicación
Debemos levantar el servidor del backend antes de levantar esta aplicación (el Front-End). Para levantar el Front-End:
```
npm start
```