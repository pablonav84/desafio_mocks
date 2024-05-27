import express from 'express';
import passport from 'passport';
import { engine } from "express-handlebars";
import cookieParser from 'cookie-parser';
import path from "path";
import { initPassport } from './config/passport.config.js';
import { UsuariosRouter } from "./routes/router/usuariosRouter.js";
import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { router as carritosRouter } from './routes/carritosRouter.js';
import { ProductosRouter } from './routes/router/productosRouter.js';
import { config } from './config/config.js';
import __dirname from "./utils.js";
import {router as vistasRouter} from "./routes/vistasRouter.js"
import { router as mailRouter } from "./routes/mailRouter.js"
import { Server } from 'socket.io';
import { ChatManager } from './dao/chatManagerMongo.js';
import { router as mockingRouter } from "./routes/mockingRouter.js";

const PORT = config.PORT;
let io;
const app = express();

const usuariosRouter=new UsuariosRouter()
const productosRouter=new ProductosRouter()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", engine({
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
 },
}))
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

initPassport()
app.use(passport.initialize())

app.use(cookieParser("CoderCoder123"))

app.use("/", vistasRouter)
app.use("/api/mock", mockingRouter);
app.use("/api/usuarios", usuariosRouter.getRouter())
app.use("/api/productos", productosRouter.getRouter())
app.use("/api/carritos", carritosRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/", mailRouter)

const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});

let mensajes=[]
let usuarios=[]

  io = new Server(server);

  let cManager=new ChatManager()
  io.on('connection', (socket) => {
    console.log(`Cliente Conectado con el id ${socket.id}`);
    socket.emit('saludo', { emisor: 'server', mensaje: 'Bienvenido al server' });

    socket.on('confirmacion', nombre => {
  usuarios.push({id:socket.id, nombre})
  socket.emit("historial", mensajes)
      socket.broadcast.emit("nuevoUsuario", nombre)
    });
    socket.on("mensaje", (nombre, mensaje) => {
      cManager.guardarMensaje(nombre, mensaje)
      .then(mensajeGuardado => {
        console.log('Mensaje guardado exitosamente:', mensajeGuardado);
      })
      .catch(error => {
        console.error('Error al guardar el mensaje:', error);
      });
      io.emit("nuevoMensaje", nombre, mensaje)
    });
    
  socket.on("disconnect", ()=>{
    let usuario=usuarios.find(u=>u.id===socket.id)
    if(usuario){
        socket.broadcast.emit("saleUsuario", usuario.nombre)
    }
  })
  socket.on("connection", socket=>{
    console.log(`Se conecto un cliente con id ${socket.id}`)
  });
  })