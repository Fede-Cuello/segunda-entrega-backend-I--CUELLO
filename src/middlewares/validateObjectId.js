const mongoose = require("mongoose")

function validateObjectId(paramName) {
  return (req, res, next) => {
    let id = req.params[paramName]
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no valido" })
    }
    next()
  }
}

module.exports = validateObjectId
