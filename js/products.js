const catId = localStorage.getItem('catID')
const url =  `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`
let filterProd = []

//Peticion de informacion al api y escritura del html
document.addEventListener('DOMContentLoaded', function(e){
    getJSONData(url)
    .then((result) => {
        if(result.status == 'ok'){
            document.getElementById('catName').innerHTML = result.data.catName;
            productsArray = result.data.products;
            showProducts(productsArray);
          }});
    
    document.querySelectorAll('.orderBtn').forEach(btn =>
        btn.addEventListener('click', () =>{
            if((filterProd != productsArray) && (filterProd.length > 0)){
                sortAndShowProd(btn.id, filterProd);
            }else{
                sortAndShowProd(btn.id, productsArray);
            }
        }));

    document.getElementById("rangeFilterPrice").addEventListener("click", function(){
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;
        filterProd = productsArray;

        if(parseInt(minPrice) > parseInt(maxPrice)){
            alert('El precio maximo debe ser mayor al precio minimo');
            document.getElementById('rangeFilterPriceMax').value = '';
            return
        };

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
            minPrice = parseInt(minPrice);
            filterProd = filterProd.filter(product => product.cost >= minPrice);
        }
        else{
            minPrice = undefined;
        };

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
            maxPrice = parseInt(maxPrice);
            filterProd = filterProd.filter(product => product.cost <= maxPrice);
        }
        else{
            maxPrice = undefined;
        };

        showProducts(filterProd);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";
        filterProd = [];
        showProducts(productsArray);
    });
})

//Presenta en la pagina la informacion obtenida
function showProducts(array){
    let toAppend = [];
    const prodCont = document.getElementById('prod-container');
    for(let product of array){
        toAppend += `
        <div onclick = 'setProdID(${product.id})' class="products list-group-item list-group-item-action cursor-active">
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
        prodCont.innerHTML = toAppend
    };
}

//Ordena array y lo muestra en la pagina ordenado
function sortAndShowProd(crit, array){    
    const sorting = {
        "UP": () => array.sort(function(a, b) { return a.cost - b.cost }),
        "DW": () => array.sort(function(a, b) { return b.cost - a.cost}),
        "SC": () => array.sort(function(a, b){ return b.soldCount - a.soldCount}),      
    }
    sortedArray = sorting[crit]();
    showProducts(sortedArray);
}

//Desafiate, realtime searchbar 
searchbar.addEventListener('input', (e) => {
    let searchInput = e.target.value.split(' ');
    const listItems = document.querySelectorAll('.products');

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
                    item.style.display = '';
                    break;
                }else{
                    item.style.display = 'none';
                    ;
                    //borrando el break, funciona como una busqueda tipo or, con el break, tipo and
                }
            };
        }else{
            if(text.toLowerCase().includes(searchInput[0].toLowerCase())){
                item.style.display = ''
            }else{
                item.style.display = 'none'
            };
        };
    })
})


function setProdID(id){
    localStorage.setItem('prodID', id)
    window.location.href = 'product-info.html'
}