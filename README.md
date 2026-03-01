# ✨ Full Stack Realtime Chat App ✨

![Demo App](/frontend/public/screenshot-for-readme.png)

[Video Tutorial on Youtube](https://youtu.be/ntKkVrQqBYY)

Highlights:

- 🌟 Tech stack: MERN + Socket.io + TailwindCSS + Daisy UI
- 🎃 Authentication && Authorization with JWT
- 👾 Real-time messaging with Socket.io
- 🚀 Online user status
- 👌 Global state management with Zustand
- 🐞 Error handling both on the server and on the client
- ⭐ At the end Deployment like a pro for FREE!
- ⏳ And much more!

### Setup .env file

```js
MONGODB_URI=...
PORT=5000  # or change both front and backend to same port
JWT_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

NODE_ENV=development
```

> **Local MongoDB**  
> For a fully local setup you must have MongoDB running on your machine or inside a container. The simplest URI is `mongodb://localhost:27017/chat-app`.  
> Examples:
>
> ```bash
> # start using the system service (Windows/Mac/Linux)
> mongod --dbpath /path/to/data
>
> # or use Docker:
> docker run --name chat-mongo -p 27017:27017 -d mongo
> ```
>
> Once the server is up, set `MONGODB_URI` in your `.env` accordingly and then run `npm run seed` from the `backend` folder to populate sample users.

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
# Chat-application
