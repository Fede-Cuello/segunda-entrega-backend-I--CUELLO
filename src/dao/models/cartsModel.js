const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")

const cartsSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      }
    }
  ]
})
  
cartsSchema.plugin(paginate)

const cartsModel = mongoose.model("carts", cartsSchema)

module.exports= cartsModel