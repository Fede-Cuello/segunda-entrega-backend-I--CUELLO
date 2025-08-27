const fs = require("fs")

class CartsManager {
  static rutaCarts = ""

  static async getCarts() {
    try {
      if (fs.existsSync(this.rutaCarts)) {
        return JSON.parse(await fs.promises.readFile(this.rutaCarts, "utf-8"))
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error leyendo los carritos:", error)
      throw new Error("No se pudieron obtener los carritos")
    }
  }

  static async createCart() {
    try {
      let carts = await this.getCarts()
      let newCart = {
        id: carts.length
          ? Math.max(...carts.map((c) => parseInt(c.id))) + 1
          : 1,
        products: [],
      }
      carts.push(newCart)

      await fs.promises.writeFile(
        this.rutaCarts,
        JSON.stringify(carts, null, 5)
      )
      return newCart
    } catch (error) {
      console.error("Error creando carrito:", error)
      throw new Error("No se pudo crear el carrito")
    }
  }

  static async getCartById(cid) {
    try {
      let carts = await this.getCarts()
      let cart = carts.find((c) => c.id == cid)
      if (!cart) return null
      return cart
    } catch (error) {
      console.error("Error obteniendo carrito por ID:", error)
      throw new Error("No se pudo obtener el carrito")
    }
  }

  static async addProductToCart(cid, pid) {
    try {
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
        JSON.stringify(carts, null, 5)
      );
      return cart
    } catch (error) {
      console.error("Error agregando producto al carrito:", error)
      throw new Error("No se pudo agregar el producto al carrito")
    }
  }

  static async deleteCart(cid) {
    try {
      let carts = await this.getCarts();
      let index = carts.findIndex((c) => c.id == cid)

      if (index === -1) return null;

      const deletedCart = carts.splice(index, 1)[0]

      await fs.promises.writeFile(
        this.rutaCarts,
        JSON.stringify(carts, null, 5)
      );

      return deletedCart;
    } catch (error) {
      console.error("Error eliminando carrito:", error)
      throw new Error("No se pudo eliminar el carrito")
    }
  }
}
      
  
module.exports= {CartsManager}