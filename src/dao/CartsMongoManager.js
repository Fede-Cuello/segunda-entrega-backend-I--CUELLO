const cartsModel=require("./models/cartsModel.js")

class CartsMongoManager {
  static async getCarts(limit=5 , page=1) {
    return await cartsModel.paginate({},{limit,page, lean:true, populate:"products.product"})
  }

  static async createCart() {
    return await cartsModel.create({ products: [] })
  }

  static async getCartById(cid) {
    return await cartsModel.findById(cid).populate("products.product").lean()
  }

  static async updateCart(cid, cart) {
    return await cartsModel.findByIdAndUpdate(cid, cart, { new: true }).lean()
  }

  static async deleteCart(cid) {
    return await cartsModel.findByIdAndDelete(cid)
  }

  static async addProductToCart(cid, products) {
    return await cartsModel.findByIdAndUpdate(cid, { products }, { new: true }).populate("products.product").lean()
  }
}

module.exports = { CartsMongoManager}
