//Tomar el valor de la categoria seleccionada en la seccion de categorias
const catId = localStorage.getItem('catID')
const url =  `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`

//Peticion de informacion al api y escritura del html
document.addEventListener('DOMContentLoaded', function(e){
    getJSONData(url)
    .then((result) => {
        if(result.status == 'ok'){
            document.getElementById('catName').innerHTML = result.data.catName
            return productsArray = result.data.products;
          }})
    .then((productsArray) => {
        showProducts()
    })
})

//Presenta en la pagina la informacion obtenida
function showProducts(){
    const prodCont = document.getElementById('prod-container')
    for(let product of productsArray){
            prodCont.innerHTML += `
            <div class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
            `
    }
}
