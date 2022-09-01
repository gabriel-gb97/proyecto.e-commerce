const catId = localStorage.getItem('catID')
const url =  `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`
const ASC_BY_PRICE = "UP";
const DESC_BY_PRICE = "DW";
const ORDER_BY_SOLD_COUNT= "SC";
let minPrice = undefined;
let maxPrice = undefined;

//Peticion de informacion al api y escritura del html
document.addEventListener('DOMContentLoaded', function(e){
    getJSONData(url)
    .then((result) => {
        if(result.status == 'ok'){
            document.getElementById('catName').innerHTML = result.data.catName
            productsArray = result.data.products;
            showProducts()
          }})

    document.getElementById("AscPrice").addEventListener("click", function(){
        sortAndShowProducts(ASC_BY_PRICE, productsArray);
    });

    document.getElementById("DescPrice").addEventListener("click", function(){
        sortAndShowProducts(DESC_BY_PRICE, productsArray);
    });

    document.getElementById("sortSoldCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT, productsArray);
    });

    document.getElementById("rangeFilterPrice").addEventListener("click", function(){
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
            minPrice = parseInt(minPrice);
        }
        else{
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
            maxPrice = parseInt(maxPrice);
        }
        else{
            maxPrice = undefined;
        }

        showProducts();
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProducts();
    });
})

//Presenta en la pagina la informacion obtenida
function showProducts(){
    let toAppend = []
    const prodCont = document.getElementById('prod-container')
    for(let product of productsArray){
        if(((minPrice == undefined) || ((minPrice != undefined) && (product.cost >= minPrice))) &&
           ((maxPrice == undefined) || ((maxPrice != undefined) && (product.cost <= maxPrice)))){
            toAppend += `
            <div class="products list-group-item list-group-item-action cursor-active">
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
            
        prodCont.innerHTML = toAppend
    }
}

//Ordena array y lo muestra en la pagina ordenado
function sortAndShowProducts(criteria, array){
    let result = [];
    if (criteria === ASC_BY_PRICE)
    {   result = array.sort(function(a, b) {return a.cost - b.cost});
    }else if (criteria === DESC_BY_PRICE){
        result = array.sort(function(a, b) {return b.cost - a.cost});
    }else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {return b.soldCount - a.soldCount});
    }
    productsArray = result;
    showProducts()
}

//Desafiate, realtime searchbar 
searchbar.addEventListener('input', (e) => {
    let searchInput = e.target.value.split(' ');
    const listItems = document.querySelectorAll('.products')

    listItems.forEach((item) => {
        text = item.innerText;
        //Object.keys, para poder acceder al objeto como un array y usar el atributo .length
        if(Object.keys(searchInput).length > 1){
            //Uso el for tradicional, para poder indexar correctamente el array searchInput
            //Usando el for, puedo hacer la busqueda mas compleja, 
            //dividiendo lo ingresado en distintos elementos spliteados por el espacio
            //para que busque por mas de una palabra ingresada
            for(let i = 0; i < Object.keys(searchInput).length ; i++){
                if((text.toLowerCase().includes(searchInput[i].toLowerCase())) && 
                (searchInput[i] != "")){
                    item.style.display = ''
                    break
                }else{
                    item.style.display = 'none'
                    break 
                    //borrando el break, funciona como una busqueda tipo or, con el break, tipo and
                }
            }
        }else{
            if(text.toLowerCase().includes(searchInput[0].toLowerCase())){
                item.style.display = ''
            }else{
                item.style.display = 'none'
            }
        }
    })
})