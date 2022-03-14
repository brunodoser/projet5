
fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((objetProduits) => {
        console.log(objetProduits);
        theKanaps(objetProduits);
    })
    .catch((error) => {
        document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource API:" + err);
    })

//fonction qui affiche des produits de l'API sur la page index
function theKanaps(articles) {

    let urlId = document.querySelector("#items");

    // boucle pour chaque indice nommé "article" dans l'index 
    for (let article of articles) {

        
    // Insertion de l'élément "a"
    let productLink = document.createElement("a");
    document.querySelector(".items").appendChild(productLink);
    productLink.href = `product.html?id=${article._id}`;

    // Insertion de l'élément "article"
    let productArticle = document.createElement("article");
    productLink.appendChild(productArticle);

    // Insertion de l'image
    let productImg = document.createElement("img");
    productArticle.appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    // Insertion du titre "h3"
    let productName = document.createElement("h3");
    productArticle.appendChild(productName);
    productName.classList.add("productName");
    productName.innerHTML = article.name;

    // Insertion de la description "p"
    let productDescription = document.createElement("p");
    productArticle.appendChild(productDescription);
    productDescription.classList.add("productName");
    productDescription.innerHTML = article.description;

    }
}