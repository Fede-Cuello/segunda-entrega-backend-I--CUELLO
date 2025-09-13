const { Router } = require("express")
const { ProductsMongoManager: ProductsManager, } = require("../dao/ProductsMongoManager")
const validateObjectId= require("../middlewares/validateObjectId")

const router = Router()



router.get("/", async (req, res) => {
    try {
        let { limit, page } = req.query
        limit = parseInt(limit) || 5
        page = parseInt(page) || 1

        let products = await ProductsManager.getProducts(limit, page)
        res.setHeader("Content-type", "application/json")
        res.status(200).json(products)
    } catch (error) {
        console.error("Error en GET /api/products:", error.message)
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

router.get("/:pid", validateObjectId("pid"), async (req, res) => {
    let { pid } = req.params

    try {
        let product = await ProductsManager.getProductById(pid)

        if (!product) {
            return res.status(404).json({ message: `No existen productos con id ${pid}`})
  }

        res.setHeader("Content-type", "application/json")
        res.status(200).json(product)
    } catch (error) {
        console.error("Error en GET /api/products/:pid:", error.message)
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

router.post("/", async (req, res) => {
    let { title, description, code, price, status, stock, category } =
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
    try {
        let productData = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category
        }

        let existentes = await ProductsManager.getProductByCode(cod)
        if (existentes) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ message: "Ya existe un producto con este code" })
        }
           
        let nuevo = await ProductsManager.addProduct(productData)

        
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

router.delete("/:pid", validateObjectId("pid"), async (req, res) => {
  let { pid } = req.params

  try {
    let deletedProduct = await ProductsManager.deleteProduct(pid)

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: `No se encontro el producto con ID ${pid}` })
    }

    let products = await ProductsManager.getProducts()
    req.socket.emit("updateProducts", products)
    req.socket.emit("deleteProduct", pid)

    res.setHeader("Content-type", "application/json")
    res.json({
      message: `Producto con ID ${pid} eliminado`,
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error en DELETE /api/products/:pid:", error.message)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

router.put("/:pid", validateObjectId("pid"), async (req, res) => {
    let { pid } = req.params
    let newData = req.body

    if (!newData || Object.keys(newData).length === 0) {
    return res
      .status(400)
      .json({ message: "No se enviaron datos para actualizar" })
    }
    
    if ("id" in newData || "_id" in newData) {
      return res
        .status(400)
        .json({ message: "No se puede modificar el ID del producto" })
    }

    try {
      let updatedProduct = await ProductsManager.updateProduct(pid, newData)

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: `No se encontro el producto con ID ${pid}` })
    }

    res.setHeader("Content-type", "application/json")
    res.json({
      message: `Producto con ID ${pid} actualizado`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error en PUT /api/products/:pid:", error.message)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})



module.exports=router