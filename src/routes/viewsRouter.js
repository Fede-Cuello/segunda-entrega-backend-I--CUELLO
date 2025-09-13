const { Router } = require("express")
const {ProductsMongoManager: ProductsManager,} = require("../dao/ProductsMongoManager")


const router = Router()


router.get("/products", async (req, res) => {
  try {
      
      let {limit,page}=req.query
      let {docs:products ,totalPages, hasPrevPage, hasNextPage,prevPage, nextPage, page: currentPage }= await ProductsManager.getProducts(limit,page)  
      res.render("products", {
        products,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page: currentPage
      })
  } catch (error) {
    console.error("Error en GET /products:", error.message)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

router.get("/realtimeProducts", async (req, res) => {
  try {
      let { limit, page } = req.query
      let { docs: products } = await ProductsManager.getProducts(limit, page) 
      res.render("realtimeProducts", { products })
  } catch (error) {
    console.error("Error en GET /realtimeProducts:", error.message)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})


module.exports=router
