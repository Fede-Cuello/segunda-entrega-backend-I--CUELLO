const productsModel = require("./models/productsModel.js")

class ProductsMongoManager {
  static async getProducts(limit = 5, page = 1) {
    return await productsModel.paginate({}, { limit, page, lean: true })
  }

  static async getProductById(pid) {
    return await productsModel.findById(pid).lean()
  }
  
  static async getProductByCode(code) {
    return await productsModel.findOne({ code }).lean()
  }

  static async addProduct(product = {}) {
    return await productsModel.create(product)
  }

  static async updateProduct(pid, product) {
    return await productsModel.findByIdAndUpdate(pid, product, { new: true }).lean()
  }

  static async deleteProduct(pid) {
    return await productsModel.findByIdAndDelete(pid)
  }
}

module.exports = { ProductsMongoManager }
