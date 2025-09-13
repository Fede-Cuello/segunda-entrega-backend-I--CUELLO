async function addToCart(pid) {
  const cid = document.getElementById("cartId").value.trim()
  if (!cid) {
    alert("Por favor ingrese un ID de carrito existente")
    return
  }

  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "POST"
    })

    if (response.ok) {
      const data = await response.json()
      alert(data.message)
    } else {
      const error = await response.json()
      alert(error.message)
    }
  } catch (error) {
    console.error("Error del servidor", error)
  }
}
