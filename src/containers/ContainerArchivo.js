const fs = require('fs');

class ContenedorArchivo {
  constructor(path) {
    this.path = path;
  }

  async save(objeto) {
    if (!objeto || typeof (objeto) != 'object' || objeto.length === 0) return console.log('Necesitamos un objeto a guardar');
    try {
      let id;
      const timestamp = Date.now();
      const lectura = fs.existsSync(this.path) ? await fs.promises.readFile(this.path, 'utf-8') : JSON.stringify([]);
      const datos = JSON.parse(lectura);
      datos.length === 0 ? id = 1 : id = datos[datos.length - 1].id + 1;
      datos.push({ ...objeto, id, timestamp });
      await fs.promises.writeFile(this.path, JSON.stringify(datos));
      console.log(`Objeto guardado con el id nº: ${id}`);
      return id;
    } catch (error) {
      console.log('Problema al guardar el archivo: ', error);
    }
  }

  async modifyProduct(id, modProduct) {
    if (!modProduct || typeof (modProduct) != 'object' || modProduct.length === 0) return console.log('Necesitamos un objeto a guardar');
    try {
      const lectura = await fs.promises.readFile(this.path, 'utf-8');
      const datos = JSON.parse(lectura);
      const modifying = datos.find(prod => prod.id === id);
      if (modifying === undefined) throw new Error('producto no encontrado');
      const i = datos.indexOf(modifying);
      datos[i] = { ...modifying, ...modProduct };
      await fs.promises.writeFile(this.path, JSON.stringify(datos));
      console.log('Producto modificado exitosamente');
      return datos[i];
    } catch (error) {
      console.log('Error al intentar modificar el producto: ', error);
    }
  }

  async getById(id) {
    if (!fs.existsSync(this.path)) return console.log('El archivo solicitado no está creado');
    try {
      const lectura = await fs.promises.readFile(this.path, 'utf-8');
      const datos = JSON.parse(lectura);
      const res = datos.filter(prod => prod.id === id);
      if (res.length === 0) {
        return null;
      } else {
        return res[0];
      }
    } catch (error) {
      console.log('Error de lectura: ', error);
    }
  }

  async getAll() {
    if (!fs.existsSync(this.path)) return console.log('El archivo solicitado no está creado');
    try {
      const lectura = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(lectura);
    } catch (error) {
      console.log('Error de lectura: ', error);
    }
  }

  async deleteById(id) {
    if (!fs.existsSync(this.path)) return console.log('El archivo solicitado no está creado');
    if (!id) return console.log('Se necesita el ID del producto a eliminar');
    if (typeof id != 'number') return console.log('El valor insertado debe ser de tipo número');
    try {
      const lectura = await fs.promises.readFile(this.path, 'utf-8')
      const datos = JSON.parse(lectura);
      const res = datos.filter(prod => prod.id === id);
      if (res.length === 0) {
        throw new Error(`El ID ${id} no se encuentra en el archivo`);
      } else {
        const newData = datos.filter(prod => prod.id != id);
        await fs.promises.writeFile(this.path, JSON.stringify(newData));
        console.log(`El producto con el ID ${id} fue eliminado correctamente`);
      }
    } catch (error) {
      console.log('Error al eliminar el producto: ', error);
    }
  }

  async deleteAll() {
    if (!fs.existsSync(this.path)) return console.log('El archivo solicitado no está creado');
    try {
      await fs.promises.writeFile(this.path, '[]')
      console.log('Todos los productos se eliminaron correctamente');
    } catch (error) {
      console.log('Error al eliminar el archivo: ', error);
    }
  }

}

module.exports = ContenedorArchivo