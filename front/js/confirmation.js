const params = new URLSearchParams(document.location.search);
const orderId = params.get("orderId");
console.log(orderId)
let otherOrder = document.getElementById("orderId");


if (orderId) {

  const idNode = document.getElementById("orderId");
  idNode.innerText = orderId;
  localStorage.removeItem('products');

} else {
  document.querySelector(".confirmation p").innerHTML = "Commande incorrecte"
}

otherOrder.addEventListener ("click", (e) => {
  e.preventDefault()
})