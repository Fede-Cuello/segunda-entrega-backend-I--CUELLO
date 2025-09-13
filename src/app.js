const express = require("express")
const { Server } = require("socket.io")
const { engine } = require("express-handlebars")
const mongoose=require("mongoose")


const productsRouter = require("./routes/productsRouter")
const cartsRouter = require("./routes/cartsRouter")
const viewsRouter= require("./routes/viewsRouter")
const { config } = require("./config/config")

const PORT = config.PORT

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

async function connectDB() {
  try {
  await mongoose.connect(
    `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASS}@cluster0.bakiwgn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    { dbName: config.DB_NAME }
  )
  console.log("coneccion exitosa a db")
} catch (error){ 
  console.log(`Error al conectar a db ${error.message}`)
}
}

connectDB()
