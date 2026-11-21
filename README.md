# node_changeorg_api

API REST en Node.js con Express y MongoDB (mayo de 2023, ciclo de DAM), pensada como servidor de una app de peticiones al estilo de Change.org. Está a medias: solo la parte de usuarios está conectada.

## Qué hay

- Registro de usuarios con la contraseña cifrada con bcrypt (`POST /api/saveUser`).
- Login que devuelve un token JWT de 30 días (`POST /api/login`).
- Rutas protegidas con el token: `getUser`, `updateUser`, `deleteUser`. Además `getUsers/:page?`, `home` y `pruebas`.
- Modelos de Mongoose para `User`, `Peticion`, `Firma` y `Categoria`. Las rutas de peticiones y firmas no están escritas: en `app.js` están comentadas.
- Colección de Postman en `postman/` con las llamadas de usuarios. Una de ellas tiene el cuerpo JSON mal formado.

Este servidor no es el que usa [ionic_changeorg](https://github.com/IkerAbad/ionic_changeorg): esa app llama a otras rutas (`/api/create-petition`, etc.) en el puerto 3000, que cubre [backend_ionic_changeorg](https://github.com/IkerAbad/backend_ionic_changeorg).

## Cómo arrancarlo

Necesita Node y un MongoDB local.

```
npm ci
npm start
```

Escucha en el puerto 3800 y se conecta a `mongodb://127.0.0.1:27017/node_changeorg`. Se puede cambiar con variables de entorno:

- `MONGO_URL`: cadena de conexión.
- `PORT`: puerto.
- `JWT_SECRET`: clave para firmar los tokens. Si no se define se usa una clave de ejemplo, que no vale para nada real.

He comprobado que el código carga con `node` y que las dependencias se instalan; no lo he probado contra un MongoDB desde aquí.

## Licencia

MIT, ver [LICENSE](LICENSE).

---

# node_changeorg_api (English)

A REST API in Node.js with Express and MongoDB (May 2023, DAM vocational course), meant as the server of a Change.org style petitions app. It is unfinished: only the users part is wired up.

## What's inside

- User sign-up with the password hashed with bcrypt (`POST /api/saveUser`).
- Login returning a 30-day JWT (`POST /api/login`).
- Token-protected routes: `getUser`, `updateUser`, `deleteUser`. Also `getUsers/:page?`, `home` and `pruebas`.
- Mongoose models for `User`, `Peticion`, `Firma` and `Categoria`. The petition and signature routes were never written: they are commented out in `app.js`.
- A Postman collection in `postman/` with the user calls. One of them has a malformed JSON body.

This is not the server [ionic_changeorg](https://github.com/IkerAbad/ionic_changeorg) uses: that app calls other routes (`/api/create-petition`, etc.) on port 3000, which [backend_ionic_changeorg](https://github.com/IkerAbad/backend_ionic_changeorg) covers.

## Running it

It needs Node and a local MongoDB.

```
npm ci
npm start
```

It listens on port 3800 and connects to `mongodb://127.0.0.1:27017/node_changeorg`. Both can be changed with environment variables:

- `MONGO_URL`: connection string.
- `PORT`: port.
- `JWT_SECRET`: key used to sign tokens. If unset, a sample key is used, which is worthless for anything real.

I checked that the code loads with `node` and that dependencies install; I have not tested it against a MongoDB from here.

## License

MIT, see [LICENSE](LICENSE).
