const { Router } = require("express")
const { CartsMongoManager: CartsManager ,} = require("../dao/CartsMongoManager")
const { ProductsMongoManager: ProductsManager, } = require("../dao/ProductsMongoManager")
const validateObjectId= require("../middlewares/validateObjectId")


const router = Router()


router.get("/", async (req, res) => {
  try {
    let carts = await CartsManager.getCarts()

    if (carts.length === 0) {
      return res.status(200).json({ message: "No hay carritos disponibles" })
    }

    res.setHeader("Content-type", "application/json")
    res.status(200).json(carts)
  } catch (error) {
    console.error("Error obteniendo carritos", error)
    res.status(500).json({ message: "Error al obtener los carritos" })
  }
});


router.post("/", async (req, res) => {
    try {
        let newCart = await CartsManager.createCart()

        res.setHeader("Content-type", "application/json")
        res.status(201).json(newCart)
    } catch (error) {
       console.error("Error creando carrito", error)
       res.status(500).json({ message: "Error al crear el carrito" }) 
    }
})

router.get("/:cid", validateObjectId("cid"), async (req, res) => {
  try {
    let { cid } = req.params;
    let cart = await CartsManager.getCartById(cid)

    if (!cart) {
      return res
        .status(404)
        .json({ message: `No existe el carrito con ID ${cid}` })
    }
    res.setHeader("Content-type", "application/json")
    res.status(200).json(cart.products)
  } catch (error) {
    console.error("Error obteniendo carrito", error)
    res.status(500).json({ message: "Error al obtener el carrito" })
  }
})

router.post(
  "/:cid/product/:pid",
  validateObjectId("pid"),
  validateObjectId("cid"),
  async (req, res) => {
    try {
      let { cid, pid } = req.params

      let product = await ProductsManager.getProductById(pid)

      if (!product) {
        return res
          .status(404)
          .json({ message: `El producto con id ${pid} no existe` })
      }

      let cart = await CartsManager.getCartById(cid)

      if (!cart) {
        return res
          .status(404)
          .json({ message: `No se encontro carrito con id ${cid} ` })
      }

      let productIndex = cart.products.findIndex(
        (p) => p.product._id.toString() === pid
      )

      if (productIndex !== -1) {
        cart.products[productIndex].quantity =
          (cart.products[productIndex].quantity || 1) + 1
      } else {
        cart.products.push({ product: pid, quantity: 1 })
      }

      let updatedCart = await CartsManager.addProductToCart(cid, cart.products)

      res.status(201).json({
        message: `Producto agregado al carrito ${cid}`,
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error agregando producto al carrito", error)
      res.status(500).json({ message: "Error al agregar producto al carrito" })
    }
  }
)


router.delete("/:cid", validateObjectId("cid"), async (req, res) => {
  try {
    let { cid } = req.params;
    let deletedCart = await CartsManager.deleteCart(cid)

    if (!deletedCart) {
      return res
        .status(404)
        .json({ message: `No existe el carrito con ID ${cid}` })
    }

    res.status(200).json({
      message: `Carrito con ID ${cid} eliminado`,
      cart: deletedCart,
    });
  } catch (error) {
    console.error("Error eliminando carrito:", error)
    res.status(500).json({ message: "Error al eliminar el carrito" })
  }
})


module.exports=router