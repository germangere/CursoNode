const express = require('express')


const { Router } = express;
const productosRouter = new Router();


// importamos la clase Container
const ContenedorArchivo = require('../containers/ContainerArchivo');

// Se instancia la clase contenedor
const Products = new ContenedorArchivo('db/dbProducts.json');


// funcion Error
function crearErrorNoEsAdmin(ruta, metodo) {
  const error = {
    error: -1,
  }
  if (ruta && metodo) {
    error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
  } else {
    error.descripcion = 'no autorizado'
  }
  return error
}

// Middleware para Administrador
const esAdmin = true

function soloAdmins(req, res, next) {
  if (!esAdmin) {
    res.json(crearErrorNoEsAdmin(req.url, req.method))
  } else {
    next()
  }
}


productosRouter.get('/', async (req, res) => {
  const products = await Products.getAll();
  res.json(products);
})

productosRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Products.getById(parseInt(id));
  res.json(product);
})

productosRouter.post('/', soloAdmins, async (req, res) => {
  const newProduct = req.body;
  const idNewProduct = await Products.save(newProduct);
  res.json(idNewProduct);
})

productosRouter.put('/:id', soloAdmins, async (req, res) => {
  const { id } = req.params;
  const modifying = req.body;
  const modProd = await Products.modifyProduct(parseInt(id), modifying);
  res.json(modProd)
})

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
  const { id } = req.params;
  const deletedProd = await Products.deleteById(parseInt(id));
  res.json(deletedProd)
})


module.exports = productosRouter