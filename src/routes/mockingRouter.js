import { Router } from "express";
import { generaProducto } from "../mocks/mockProductos.js";
import { argumentosProductos } from "../utils/errorProductos.js";
import { ERRORES } from "../utils/erroresIndice.js";
import fs from "fs"
import CustomError from "../utils/errorCustom.js";
import ProductManager from "../manager/productosManager.js";

export const router = Router()
const pm = new ProductManager()

router.get('/mockingproducts', async (req, res) => {
    const productos = await pm.cienProductos();
    res.json(productos);
  });

  router.get('/visualizarproductos', async (req, res) => {
    
    const allProducts = await pm.obtenerProductos();
    res.json(allProducts)
  });

  router.get('/producto/:code', async (req, res) => {
    
    const code = req.params.code;
  
    const producto = await pm.obtenerProductoPorCode(code);
  
    if (producto) {
      res.json({producto});
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  });

  router.post('/crearproducto', async (req, res) => {
    let { code, descrip, precio, stock } = req.body;
  
    function handleFieldError(fieldName, fieldValue) {
      if (!fieldValue) {
        throw CustomError.createError({
          name: "Error al crear producto",
          cause: argumentosProductos(req.body),
          message: `Complete la propiedad '${fieldName}'`,
          code: ERRORES['ARGUMENTOS_INVALIDOS']
        });
      }
    }
  
    const productos = JSON.parse(fs.readFileSync('./src/data/productos.json', 'utf8'));
    const codigoExistente = productos.some((producto) => producto.code === code);
  
    if (codigoExistente) {
      const error = {
        message: "El código ingresado ya existe",
        code: ERRORES['CODIGO_EXISTENTE']
      };
      res.status(400).json({ error });
      return;
    }
    
    try {
      handleFieldError('code', code);
      handleFieldError('descrip', descrip);
      handleFieldError('precio', precio);
      handleFieldError('stock', stock);
  
      if (isNaN(code) || isNaN(precio) || isNaN(stock)) {
        const error = {
          message: "Los campos 'code', 'precio' y 'stock' deben ser números",
          code: ERRORES['ARGUMENTOS_INVALIDOS']
        };
        res.status(400).json({ error });
        return;
      }
      const nuevoProducto = await pm.crearProducto(code, descrip, precio, stock);
      res.json(nuevoProducto);
    } catch (error) {
      console.error(error);
      res.status(400).json({ 
        error: {
          message: error.message,
          name: error.name,
          code: error.code,
          cause: error.cause
        }
      });
    }
  });