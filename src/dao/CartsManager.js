const fs = require("fs")

class CartsManager {
  static rutaCarts = "";

  static async getCarts() {
    if (fs.existsSync(this.rutaCarts)) {
      return JSON.parse(await fs.promises.readFile(this.rutaCarts, "utf-8"));
    } else {
      return [];
    }
  }

  static async createCart() {
    let carts = await this.getCarts();
    let newCart = {
      id: carts.length ? Math.max(...carts.map((c) => parseInt(c.id))) + 1 : 1,
      products: [],
    };
    carts.push(newCart);

    await fs.promises.writeFile(this.rutaCarts, JSON.stringify(carts, null, 5));
    return newCart;
  }

  static async getCartById(cid) {
    let carts = await this.getCarts();
    let cart = carts.find((c) => c.id == cid);
    if (!cart) return null;
    return cart;
  }

  static async addProductToCart(cid, pid) {
    let carts = await this.getCarts()

    let cart = carts.find((c) => c.id == cid)
    if (!cart) return null

    let productInCart = cart.products.find((p) => p.product == pid)

    if (productInCart) {
      productInCart.quantity++
    } else {
      cart.products.push({ product: pid, quantity: 1 })
    }

    await fs.promises.writeFile(
      this.rutaCarts,
      JSON.stringify(carts, null, 5))

    return cart
  }
}


module.exports= {CartsManager}