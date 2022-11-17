//---------------------------------------------------------------------
//        EXPRESS
//---------------------------------------------------------------------
import { fileURLToPath } from "url";
import { dirname } from "path";
import http from "http";
import { createServer } from "http";
import express from "express";
import session from "express-session";
import { Server } from "socket.io";
import { socketController } from "./src/utils/socketController.js"
import { productosRouter, homeRouter, loginRouter, signupRouter, logoutRouter, infoRouter, apiRandomRouter } from "./routes/index.js";
// import MongoStore from "connect-mongo";

//---------------------------------------------------------------------
//                      VARIABLES DE ENTORNO
//---------------------------------------------------------------------

import { MONGOPW, PORT, MODO } from "./config.js"

//---------------------------------------------------------------------
//       Creacion de servidor e implementacion Websockets.Io
//---------------------------------------------------------------------
const app = express();
// const PORT = process.env.PORT || 8080;
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
socketController(io);

//---------------------------------------------------------------------
//                        MIDDLEWARE
//---------------------------------------------------------------------
//LOGIN
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import redis from "redis";
import connectRedis from "connect-redis";
import mongoose from "mongoose";
import Usuarios from "./models/usuarioSchema.js";
import { isValidPassword, createHash } from "./src/utils/passwordsFunctions.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//CONECCION A DB
mongoose
  .connect(
    `mongodb+srv://admin:${MONGOPW}@ecommerce.sewmc4q.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  );


  //MOTOR EJS
app.set('view engine', 'ejs');
app.set("views", "./views");


//CONFIGURACION LOGIN DE PASSPORT
passport.use(
  //login es el action
  "login",
  // IMPORTANTE: respetar las palabras username y password
  new LocalStrategy((username, password, done) => {
    Usuarios.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log("User not found with username " + username);
        return done(null, false);
        //null significa sin error, y false parametro a enviar
      }
      if (!isValidPassword(user, password)) {
        console.log("Invalid Password");
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

//CONFIGURACION SIGNUP DE PASSPORT
passport.use(
  "signup",
  new LocalStrategy(
    //aca indicas que siempre necesitas password, y pasa todo el request al callback.
    //Por ejemplo si pasaras mas props y no solo username y password
    { passReqToCallback: true },
    (req, username, password, done) => {
      Usuarios.findOne({ username: username }, function (error, user) {
        if (error) {
          console.log("Error in SingnUp: " + error);
          return done(error);
        }
        if (user) {
          console.log("User already exists");
          return done(null, false);
        }
        const newUser = {
          username: username,
          password: createHash(password),
        };
        Usuarios.create(newUser, (err, user) => {
          if (err) {
            console.log("Error in Saving user: " + err);
            return done(err);
          }
          console.log("User Registration succesful");
          //con lo siguiente quedas logueado, creas la session
          return done(null, user);
        });
      });
    }
  )
);

//CONFIGURACION DE REDIS
const client = redis.createClient({ legacyMode: true });
client.connect();
const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ host: "localhost", port: 6379, client, ttl: 300 }),
    secret: "keyboard cat",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 86400000, // 1 dia
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

// MIDDLEWARES DE PASSPORT
//passport necesita hacer esto con todas las sesiones, debido a que tiene muchas estrategias, para poder guardar la sesion
passport.serializeUser((user, done) => {
  done(null, user._id);
});
// lo busca en base de datos
passport.deserializeUser((id, done) => {
  Usuarios.findById(id, done);
});

app.use(passport.initialize());
app.use(passport.session());


//-----------------------------------------Session en mongo-------------------------------------------//
// app.use(
//   session({
//     store: MongoStore.create({
//       mongoUrl: 
//         "mongodb+srv://admin:admin123@ecommerce.sewmc4q.mongodb.net/test",
//       mongoOptions: advancedOptions,
//     }),
//     secret: "secreto",
//     cookie: { maxAge: 600000 },
//     //resave viene de la documentacion
//     resave: false,
//     saveUninitialized: false,
//   })
// );

//Maxage
app.use((req, res, next) => {
  req.session.touch();
  next();
});

//---------------------------------------------------------------------//
//                            RUTAS                                    //
//---------------------------------------------------------------------//


//Ruta de api
app.use("/api/productos", productosRouter)


app.get("/", (req, res) => {
  res.send("Bienvenidos a Hipercompumundomegared");
});

app.use("/api/productos", productosRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/home", homeRouter);
app.use("/logout", logoutRouter);
app.use("/info", infoRouter);
app.use("/api/random", apiRandomRouter);


function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

app.get("/ruta-protegida", checkAuthentication, (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  res.send("<h1>Ruta ok!</h1>" + JSON.stringify(user));
});

//---------------------------------------------------------------------//
//                    SERVIDOR FORK FOREVER                            //
//---------------------------------------------------------------------//
// const cluster = require("cluster");
import cluster from "cluster";
// const os = require("os");
import os from "os";

const numCPUs = os.cpus().length;

if (MODO === "CLUSTER") {
  if (cluster.isPrimary) {
    console.log("MODO CLUSTER");
    console.log("Servidor Funcionando en Puerto: " + PORT);
    console.log(`Master es el PID ${process.pid} `);
    // fork workers.
    console.log(numCPUs);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      cluster.fork();
      console.log(`worker ${worker.process.pid} murio`);
    });
  } else {
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
      console.log(`inicie un Worker nuevo ${process.pid}`);
    });
    ////////////////////// SOCKET
    const io = new Server(httpServer, {});
    socketController(io);
    /////////////////////
  }
} else {
  const httpServer = http.createServer(app);
  //////////////////////// SOCKET
  const io = new Server(httpServer, {});
  socketController(io);
  ///////////////////////
  httpServer.listen(PORT, () => {
    console.log("Servidor Funcionando en Puerto: " + PORT);
    console.log("MODO FORK");
  });
  httpServer.on("error", (error) => console.log(`Error en servidor ${error}`));
}

//Socket
// import { socketModel } from "./src/utils/socket.js";
// socketModel(io);

//Inicio del servidor
// httpServer.listen(PORT, () => console.log("Servidor funcionando en puerto " + `${PORT}`));