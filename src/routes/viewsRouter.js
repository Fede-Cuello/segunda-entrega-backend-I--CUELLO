const { Router } = require("express")
const { ProductsManager } = require("../dao/ProductsManager")


const router = Router()


router.get("/products", async (req, res) => {
    try {
    let products = await ProductsManager.getProducts()  
        res.render("products", { products })
  } catch (error) {
    console.error("Error en GET /products:", error.message)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

router.get("/realtimeProducts", async (req, res) => {
  try {
    let products = await ProductsManager.getProducts()
    res.render("realtimeProducts", { products })
  } catch (error) {
    console.error("Error en GET /products:", error.message)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})


module.exports=router
