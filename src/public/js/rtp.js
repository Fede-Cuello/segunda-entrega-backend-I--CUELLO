const socket = io()
const ulProducts = document.getElementById("products")

socket.on("updateProducts", (products) => {
  ulProducts.innerHTML = ""
  products.forEach((product) => {
    let li = document.createElement("li")
    li.dataset.id = product.id
    li.textContent = `${product.title} - $${product.price}`
    ulProducts.appendChild(li)
  })

})

socket.on("newProduct", (product) => {
  alert(`Nuevo producto agregado: ${product.title}`)
})

socket.on("deleteProduct", (pid) => {
  alert(`El producto con ID: ${pid} fue eliminado`)
})