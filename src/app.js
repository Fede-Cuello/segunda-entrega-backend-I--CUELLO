const express = require("express")
const { Server } = require("socket.io")
const {engine}=require("express-handlebars")


const productsRouter = require("./routes/productsRouter")
const cartsRouter = require("./routes/cartsRouter")
const viewsRouter= require("./routes/viewsRouter")

const PORT = 8080

const app = express()

app.engine("hbs", engine({ extname: "hbs" }))
app.set("view engine", "hbs")
app.set("views", "./src/views")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

app.use('/api/products',
  (req, res, next) => {
    req.socket = io
    next ()
  },
  productsRouter)
    

app.use("/api/carts", cartsRouter)

app.use("/", viewsRouter)



app.get("/api", (req, res) => {
    
  res.setHeader('Content-type','text/plain')
  res.status(200).send('ok')
})



const serverHTTP=app.listen(PORT, () => {
    console.log(`Server on line en puerto ${PORT}`)
})

const io = new Server(serverHTTP)
