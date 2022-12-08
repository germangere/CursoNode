const express = require('express')


const { Router } = express;
const carritosRouter = new Router();


// importamos la clase Container
const ContenedorArchivo = require('../containers/ContainerArchivo');

// Se instancia la clase contenedor
const Cart = new ContenedorArchivo('./db/dbCarts.json');



// Endpoints
carritosRouter.post('/', async (req, res) => {
  const newCart = await Cart.save({
    timestamp: Date.now(),
    products: []
  });
  res.json(newCart);
})

carritosRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const delCart = await Cart.deleteById(parseInt(id));
  res.json(delCart);
})

carritosRouter.get('/:id/products', async (req, res) => {
  const { id } = req.params;
  const { products } = await Cart.getById(parseInt(id));
  res.json(products);
})


carritosRouter.post('/:id/products', async (req, res) => {
  const { id } = req.params;
  const { products } = await Cart.getById(parseInt(id));
  const addProduct = req.body;
  products.push(addProduct);
  const addedCart = await Cart.modifyProduct(parseInt(id), { products });
  res.json(addedCart);
})


carritosRouter.delete('/:id/products/:id_prod', async (req, res) => {
  const { id, id_prod } = req.params;
  const { products } = await Cart.getById(parseInt(id));
  console.log(products)
  const newProducts = products.filter(prod => prod.id != parseInt(id_prod));
  console.log(newProducts)
  const deletedProdCart = await Cart.modifyProduct(parseInt(id), { products: newProducts });
  res.json(deletedProdCart);
})

module.exports = carritosRouter