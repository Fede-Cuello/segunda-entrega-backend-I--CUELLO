const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")

const productsSchema = new mongoose.Schema({
    title: String,
    code: {
      type: String,
      unique: true,
    },
    price: Number,
    stock: {
      type: Number,
      default: 0,
    },
    description: String,
    category: String,
    status: Boolean,
    },
    {
    timestamps:true
  }
)
  
productsSchema.plugin(paginate)

const productsModel = mongoose.model("products", productsSchema)

module.exports= productsModel