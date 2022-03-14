let productInLocalStorage = JSON.parse(localStorage.getItem('products'));
console.log(productInLocalStorage);

//Création des expressions regex 
let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
let letterRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

// Récupération des articles de l'API et des données de l'API dans le DOM
//
fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
        if (productInLocalStorage) {
            for (p of productInLocalStorage) {
                // selection de l'objet back correspondant a l'objet storage
                const product = data.find(d => d._id === p.idProduit);
                if (product) {
                    // on affecte le prix au produit du local storage
                    p.price = product.price;
                }
            }
        }
        getCart();
        productDelete();
        modifyMyQuantity();


        console.log(data);
    });

/* Si des produits sont présents dans le panier, les afficher sur la page du panier avec une ligne par produit qui
reprend les informations du produit ainsi que la quantité et le prix.
Affichage du prix total. Si aucun produit dans le panier, affichage d’un message indiquant que le panier est vide */
function getCart() {
    // Si le panier est vide 
    if (!productInLocalStorage) {

        const titleCart = document.querySelector("h1");
        const sectionCart = document.querySelector(".cart");

        titleCart.innerHTML = "Votre panier est vide !";
        sectionCart.style.display = "none";
        // Si le panier est remplie
    } else {
        productInLocalStorage.forEach((produit, i) => {

            // Insertion de l'élément "article"
            let productArticle = document.createElement("article");
            document.querySelector("#cart__items").appendChild(productArticle);
            productArticle.className = "cart__item";
            productArticle.setAttribute('data-id', produit._id);


            // Insertion de l'élément "div"
            let productDivImg = document.createElement("div");
            productArticle.appendChild(productDivImg);
            productDivImg.className = "cart__item__img";


            // Insertion de l'image
            let productImg = document.createElement("img");
            productDivImg.appendChild(productImg);
            productImg.src = produit.imageUrl;
            productImg.alt = produit.altTxt;

            // Insertion de l'élément "div"            
            let productItemContent = document.createElement("div");
            productArticle.appendChild(productItemContent);
            productItemContent.className = "cart__item__content";

            // Insertion de l'élément "div"
            let productItemContentDescription = document.createElement("div");
            productItemContent.appendChild(productItemContentDescription);
            productItemContentDescription.className = "cart__item__content__description";

            // Insertion de l'élément "h2"
            let productTitle = document.createElement("h2");
            productItemContentDescription.appendChild(productTitle);
            productTitle.innerHTML = produit.name;


            // Insertion de la couleur
            let productGreen = document.createElement("p");
            productTitle.appendChild(productGreen);
            productGreen.innerHTML = produit.couleurProduit;

            // Insertion de l'élément "p"
            let productPrice = document.createElement("p");
            productTitle.appendChild(productPrice);
            productPrice.innerHTML = produit.price + " €";

            // Insertion de l'élément "div"
            let productItemSettings = document.createElement("div");
            productArticle.appendChild(productItemSettings);
            productItemSettings.className = "cart__item__content__settings";

            // Insertion de l'élément "div"
            let productItemSettingsQuantity = document.createElement("div");
            productItemSettings.appendChild(productItemSettingsQuantity);
            productItemSettingsQuantity.className = "cart__item__content__settings__quantity";


            // Insertion de "Qté : "
            let productQte = document.createElement("p");
            productItemSettingsQuantity.appendChild(productQte);
            console.log(produit)
            productQte.innerHTML = "Qté : ";


            // Insertion de la quantité
            let productInsertionQuantity = document.createElement("input");
            productItemSettingsQuantity.appendChild(productInsertionQuantity);
            productInsertionQuantity.className = "itemQuantity";
            productInsertionQuantity.value = produit.quantiteProduit;
            productInsertionQuantity.setAttribute("type", "number");
            productInsertionQuantity.setAttribute("name", "itemQuantity-" + produit.idProduit);
            productInsertionQuantity.setAttribute("min", "1");
            productInsertionQuantity.setAttribute("max", "100");


            // Insertion de l'élément "div"
            let productItemContentSettingsDelete = document.createElement("div");
            productArticle.appendChild(productItemContentSettingsDelete);
            productItemContentSettingsDelete.className = "cart__item__content__settings__delete";


            // Insertion de "p" supprimer
            let productItemDelete = document.createElement("p");
            productItemContentSettingsDelete.appendChild(productItemDelete);
            productItemDelete.className = "deleteItem";
            productItemDelete.innerHTML = "Supprimer";
        })
        getTotals()
    }
}

function getTotals() {
    // Récupération du total des quantités
    let elementsQuantity = document.getElementsByClassName("itemQuantity");
    console.log(elementsQuantity);
    let quantityTotal = 0;

    for (let i = 0; i < elementsQuantity.length; ++i) {
        quantityTotal += elementsQuantity[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById("totalQuantity");
    productTotalQuantity.innerHTML = quantityTotal;
    console.log(quantityTotal);

    // Récupération du prix total
    let priceTotal = 0;

    for (let i = 0; i < elementsQuantity.length; ++i) {
        priceTotal += (elementsQuantity[i].valueAsNumber * productInLocalStorage[i].price);
        console.log(productInLocalStorage);
    }

    let productTotalPrice = document.getElementById("totalPrice");
    productTotalPrice.innerHTML = priceTotal;
    console.log(priceTotal);

}

// Suppression d'un produit
function productDelete() {
    let buttonDelete = document.querySelectorAll(".deleteItem");

    for (let a = 0; a < buttonDelete.length; a++) {
        buttonDelete[a].addEventListener("click", (e) => {
            e.preventDefault();

            //Selection de l'element à modifier en fonction de son id ET sa couleur
            let idDelete = productInLocalStorage[a].idProduit;
            let colorDelete = productInLocalStorage[a].couleurProduit;


            productInLocalStorage = productInLocalStorage.filter(element => element.idProduit !== idDelete || element.couleurProduit !== colorDelete)
            // suppression de la propriete price dans chaque objet
            productInLocalStorage.map(p => delete p.price)
            localStorage.setItem("products", JSON.stringify(productInLocalStorage));

            if (productInLocalStorage.length === 0) {
                localStorage.removeItem('products');
            }


            alert("Ce produit a bien été supprimé du panier");
            location.reload();
        })
    }
}


//Fonction Modification de la quantité

function modifyMyQuantity() {
    //Selection de l'element à modifier en fonction de son id ET sa couleur
    let modifyQte = document.querySelectorAll(".itemQuantity");

    for (let c = 0; c < modifyQte.length; c++) {
        modifyQte[c].addEventListener("change", (e) => {
            e.preventDefault();
            if (modifyQte[c].name === "itemQuantity-" + productInLocalStorage[c].idProduit) {

                let quantiteModifValue = modifyQte[c].valueAsNumber;

                productInLocalStorage[c].quantiteProduit
                productInLocalStorage[c].quantiteProduit = quantiteModifValue;
                // suppresion de la propriete price dans chaque objet
                productInLocalStorage.map(p => delete p.price)

                localStorage.setItem("products", JSON.stringify(productInLocalStorage));
                location.reload();
            }
        })
    }
}

//Instauration du formulaire avec des regex
function formGet() {
    // Ajout des Regex pour le formulaire
    let form = document.querySelector(".cart__order__form");

    // Ecoute de la modification du prénom
    form.firstName.addEventListener('change', function () {
        validFirstName(this);
    });

    // Ecoute de la modification du nom
    form.lastName.addEventListener('change', function () {
        validLastName(this);
    });

    // Ecoute de la modification de l'adresse
    form.address.addEventListener('change', function () {
        validAddress(this);
    });

    // Ecoute de la modification de la ville
    form.city.addEventListener('change', function () {
        validCity(this);
    });

    // Ecoute de la modification de l'email
    form.email.addEventListener('change', function () {
        validEmail(this);
    });

    //validation du Prénom
    const validFirstName = function (inputFirstName) {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (letterRegExp.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = '';
        } else {
            firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation du Nom
    const validLastName = function (inputLastName) {
        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (letterRegExp.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = '';
        } else {
            lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de l'adresse
    const validAddress = function (inputAddress) {
        let addressErrorMsg = inputAddress.nextElementSibling;

        if (addressRegExp.test(inputAddress.value)) {
            addressErrorMsg.innerHTML = '';
        } else {
            addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de la ville
    const validCity = function (inputCity) {
        let cityErrorMsg = inputCity.nextElementSibling;

        if (letterRegExp.test(inputCity.value)) {
            cityErrorMsg.innerHTML = '';
        } else {
            cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de l'adresse Email
    const validEmail = function (inputEmail) {
        let emailErrorMsg = inputEmail.nextElementSibling;

        if (emailRegExp.test(inputEmail.value)) {
            emailErrorMsg.innerHTML = '';
        } else {
            emailErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };
}
formGet();
console.log(formGet);

// fonction pour l'Envoi des informations client au localstorage
function postForm() {

    let buttonCommander = document.getElementById("order");

    buttonCommander.addEventListener("click", (event) => {
        event.preventDefault()
        // Récupération des coordonnées du formulaire du client 
        let inputFirstName = document.getElementById('firstName');
        let inputLastName = document.getElementById('lastName');
        let inputAddress = document.getElementById('address');
        let inputCity = document.getElementById('city');
        let inputEmail = document.getElementById('email');

        if (productInLocalStorage.length !== 0 && emailRegExp.test(inputEmail.value) && letterRegExp.test(inputFirstName.value) && letterRegExp.test(inputLastName.value) && addressRegExp.test(inputAddress.value) && letterRegExp.test(inputCity.value)) {
        

            // création d'un array depuis le Local Storage
            let id_Product = [];
            for (let i = 0; i < productInLocalStorage.length; i++) {
                id_Product.push(productInLocalStorage[i].idProduit);
            }
            console.log(id_Product);

            const order = {
                contact: {
                    firstName: inputFirstName.value,
                    lastName: inputLastName.value,
                    address: inputAddress.value,
                    city: inputCity.value,
                    email: inputEmail.value,
                },
                products: id_Product
            }

    

            const options = {
                method: 'POST',
                body: JSON.stringify(order),
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                },
            };

            fetch("http://localhost:3000/api/products/order", options)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (data.orderId) {
                        console.log(data);
                       
                        document.location.href = "confirmation.html?orderId="+data.orderId;
                    } else {
                        document.location.href = "confirmation.html";
                    }
                })
                .catch((err) => {

                    alert("Problème serveur : " + err.message);
                });
        } else if (!productInLocalStorage) {

            const titleCart = document.querySelector("h1");
            const sectionCart = document.querySelector(".cart");

            titleCart.innerHTML = "Votre panier est vide !";
            sectionCart.style.display = "none";
            buttonCommander.addEventListener("click", function (event) {
                event.preventDefault()
            })
        }
    });


}
postForm();



