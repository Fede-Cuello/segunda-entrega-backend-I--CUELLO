const fs = require("fs")

class ProductsManager {
  static rutaProducts = ""

  static async getProducts() {
    if (fs.existsSync(this.rutaProducts)) {
      return JSON.parse(await fs.promises.readFile(this.rutaProducts, "utf-8"))
    } else {
      return []
    }
  }

  static async getProductsById(pid) {
    let products = await this.getProducts()
    let product = products.find((p) => p.id == pid)
      
      return product
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
    };

    products.push(newProduct)

    await fs.promises.writeFile(
      this.rutaProducts,
      JSON.stringify(products, null, 5)
    )

    return newProduct
  }

  static async deleteProduct(pid) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((p) => p.id == pid)
    
    if (productIndex === -1) return null

    let deletedProduct = products[productIndex]

    products.splice(productIndex, 1)

    await fs.promises.writeFile(
      this.rutaProducts,
      JSON.stringify(products, null, 5)
    )

    return deletedProduct
  }

  static async updateProduct(pid, newData) {
    let products = await this.getProducts()
    let productIndex = products.findIndex((p) => p.id == pid);

    
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
    );

    return updatedProduct
  }
}


module.exports= {ProductsManager}