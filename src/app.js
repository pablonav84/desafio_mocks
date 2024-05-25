import express from 'express';
import { router as mockingRouter } from "./routes/mockingRouter.js"
const app = express();
const PORT=3000

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/", mockingRouter);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

