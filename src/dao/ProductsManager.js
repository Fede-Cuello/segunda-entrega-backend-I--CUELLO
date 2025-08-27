const fs = require("fs")

class ProductsManager {
  static rutaProducts = ""

  static async getProducts() {
    try {
      if (fs.existsSync(this.rutaProducts)) {
      return JSON.parse(await fs.promises.readFile(this.rutaProducts, "utf-8"))
    } else {
      return []
    }
    } catch (error) {
      console.error("Error leyendo productos:", error)
      throw new Error("No se pudieron obtener los productos")
    }
    
  }

  static async getProductsById(pid) {
    try {
      let products = await this.getProducts()
      let product = products.find((p) => p.id == pid)
      
      return product
    } catch (error) {
      console.error("Error obteniendo producto por ID:", error)
      throw new Error("No se pudo obtener el producto")
    }
  }

  static async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {

    try {
      let products = await this.getProducts()

      let exists = products.find((p) => p.code === code)
      if (exists) {
        return null
      }

      let id = 1
        if (products.length > 0) {
          id = Math.max(...products.map((p) => parseInt(p.id))) + 1
    }

      let newProduct = {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    }

    products.push(newProduct)

    await fs.promises.writeFile(
      this.rutaProducts,
      JSON.stringify(products, null, 5)
    )

    return newProduct
    } catch (error) {
      console.error("Error agregando producto:", error)
      throw new Error("No se pudo agregar el producto")
    }
  }

  static async deleteProduct(pid) {
    try {
      let products = await this.getProducts()
      let productIndex = products.findIndex((p) => p.id == pid)
    
      if (productIndex === -1) return null

      let deletedProduct = products[productIndex]

      products.splice(productIndex, 1)

      await fs.promises.writeFile(
      this.rutaProducts,
      JSON.stringify(products, null, 5))

    return deletedProduct
    } catch (error) {
      console.error("Error eliminando producto:", error)
      throw new Error("No se pudo eliminar el producto")
    }
  }

  static async updateProduct(pid, newData) {
    try {
      let products = await this.getProducts()
      let productIndex = products.findIndex((p) => p.id == pid)

    
      if (productIndex === -1) return false

      const updatedProduct = {
    ...products[productIndex],
    ...newData,
    id: products[productIndex].id, 
  }

  
     products[productIndex] = updatedProduct

    await fs.promises.writeFile(
      this.rutaProducts,
      JSON.stringify(products, null, 5)
    )

    return updatedProduct
    } catch (error) {
      console.error("Error actualizando producto:", error)
      throw new Error("No se pudo actualizar el producto")
    }
    
  }
}


module.exports= {ProductsManager}