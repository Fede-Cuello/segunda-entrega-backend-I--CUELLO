const express = require("express")
const { ProductsManager } = require("./dao/ProductsManager")
const {CartsManager}=require("./dao/CartsManager")

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

ProductsManager.rutaProducts = "./src/data/products.json"
CartsManager.rutaCarts="./src/data/carts.json"

app.get("/api", (req, res) => {
    
  res.setHeader('Content-type','text/plain')
  res.send("inicio")
})

app.get("/api/products", async (req, res) => {
  let products = await ProductsManager.getProducts()

  res.setHeader('Content-type','application/json' )
  res.json(products)
})

app.get("/api/products/:pid", async (req, res) => {
  let {pid} =req.params
  let product = await ProductsManager.getProductsById(pid)

  if (!product) {
    
    return res.status(404).json(
        { message: `No existen productos con id ${pid}` }
      )
  }

    res.setHeader('Content-type', 'application/json')
    res.status(200).json(product)
})


app.post("/api/products", async (req, res) => {
  let {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
    } = req.body
    
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
    return res.status(400).json ({message:"Ya existe un producto con este codigo"})
  }

    res.setHeader('Content-type', 'application/json')
    res.status(201).json({
      message: `Producto agregado`,
      product: nuevo,
    })
})

app.delete("/api/products/:pid", async (req, res) => {
    let {pid} = req.params

    let deletedProduct = await ProductsManager.deleteProduct(pid)

  if (!deletedProduct) {
      
      return res.status(404).send(`No se encontro el producto con ID ${pid}`)
  }

  res.setHeader('Content-type', 'application/json')
  res.json({
    message: `Producto con ID ${pid} eliminado`,
    product: deletedProduct,
  })
})

app.put("/api/products/:pid", async (req, res) => {
    let {pid}= req.params
    let newData = req.body
    
    let updatedProduct = await ProductsManager.updateProduct(pid, newData)

  if (!updatedProduct) {
      
      return res.status(404).send(`No se encontro el producto con ID ${pid}`)
    }

    res.setHeader('Content-type', 'application/json')
    res.json({
     message: `Producto con ID ${pid} actualizado`,
     product: updatedProduct,
   })
})

app.post("/api/carts", async (req, res) => {
  let newCart = await CartsManager.createCart()

  res.setHeader('Content-type', 'application/json')
  res.status(201).json(newCart)
})

app.get("/api/carts/:cid", async (req, res) => {
  let { cid } = req.params
  let cart = await CartsManager.getCartById(cid)

  if (!cart) {
    return res
      .status(404)
      .json({ message: `No existe el carrito con ID ${cid}` })
  }
  res.setHeader('Content-type', 'application/json')
  res.status(200).json(cart.products)
})

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;

  let updatedCart = await CartsManager.addProductToCart(cid, pid)

  if (!updatedCart) {
    return res
      .status(404)
      .json({ message: `No se encontro carrito con id ${cid} ` })
  }

  res.status(201).json({
    message: `Producto agregado al carrito ${cid}`,
    cart: updatedCart,
  })
})

app.listen(PORT, () => {
    console.log(`Server on line en puerto ${PORT}`)
})

