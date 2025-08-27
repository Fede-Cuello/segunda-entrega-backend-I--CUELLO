const { Router } = require("express")
const { ProductsManager } = require("../dao/ProductsManager")


const router = Router()

ProductsManager.rutaProducts = "./src/data/products.json"


router.get("/", async (req, res) => {
    try {
        let products = await ProductsManager.getProducts()
        res.setHeader("Content-type", "application/json")
        res.json(products)
    } catch (error) {
        console.error("Error en GET /api/products:", error.message)
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

router.get("/:pid", async (req, res) => {
    try {
        let { pid } = req.params
        let product = await ProductsManager.getProductsById(pid)

        if (!product) {
            return res
                .status(404)
                .json({ message: `No existen productos con id ${pid}` })
  }

        res.setHeader("Content-type", "application/json")
        res.status(200).json(product)
    } catch (error) {
        console.error("Error en GET /api/products/:pid:", error.message)
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

router.post("/", async (req, res) => {
    try {
        let { title, description, code, price, status, stock, category, thumbnails } =
            req.body
        
        if (!title || !code || !price) {
            return res.status(400).json({
                message:"Debes ingresar al menos 'title' , 'code' y 'price'"
            })
        }

        if (isNaN(price) || price <= 0) {
          return res.status(400).json({
            message: "El campo 'price' debe ser un número mayor a 0",
          })
        }

        let nuevo = await ProductsManager.addProduct(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
  )

    if (!nuevo) {
        return res
            .status(400)
            .json({ message: "Ya existe un producto con este code" })
  }
        let products = await ProductsManager.getProducts()
        req.socket.emit("updateProducts", products)
        req.socket.emit("newProduct", nuevo)
        
        res.setHeader("Content-type", "application/json")
        res.status(201).json({
        message: `Producto agregado`,
        product: nuevo,
  })
    } catch (error){
        console.error("Error en POST /api/products:", error.message)
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        let { pid } = req.params
        let deletedProduct = await ProductsManager.deleteProduct(pid)

    if (!deletedProduct) {
        return res
            .status(404)
            .json({message:`No se encontro el producto con ID ${pid}`})
        }
        
        
    let products = await ProductsManager.getProducts()
        req.socket.emit("updateProducts", products)
        req.socket.emit("deleteProduct", pid)
        
    res.setHeader("Content-type", "application/json")
    res.json({
    message: `Producto con ID ${pid} eliminado`,
    product: deletedProduct,
  })    
    } catch (error) {
        console.error("Error en DELETE /api/products/:pid:", error.message)
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

router.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params
        let newData = req.body
        let updatedProduct = await ProductsManager.updateProduct(pid, newData)

    if ("id" in newData && newData.id != pid) {
      return res.status(400).json({
        message: "No se puede modificar el ID del producto",
      })
    }
        
    if (!updatedProduct) {
        return res
            .status(404)
            .json({message:`No se encontro el producto con ID ${pid}`})
  }

    res.setHeader("Content-type", "application/json")
    res.json({
    message: `Producto con ID ${pid} actualizado`,
    product: updatedProduct,
  }) 
    } catch (error) {
       console.error("Error en PUT /api/products/:pid:", error.message)
       res.status(500).json({ error: "Error interno del servidor" }) 
    }
})



module.exports=router