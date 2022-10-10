const prodID = localStorage.getItem('prodID');
const URL = `https://japceibal.github.io/emercado-api/products/${prodID}.json`;
const commURL = `https://japceibal.github.io/emercado-api/products_comments/${prodID}.json`;
const loggedUser = localStorage.getItem('regEmail').split('@')[0];
let toCartS = {};
const toastLiveExample = document.getElementById('liveToast');

document.addEventListener('DOMContentLoaded', () => {
    let result = {}
    getJSONData(URL)
    .then((response) =>{
        if(response.status == 'ok'){
            result = response
            return result
            
        }})
    .then((result) => {
            const {data: itemArray} = result;
            const { id, category, cost, 
                    currency, description, 
                    images, name, soldCount, relatedProducts } = itemArray
            toCartS = {id: id, name: name, unitCost:cost, currency, image: images[0]};            
            document.getElementById('itemName').innerHTML = name
            document.getElementById('item-cont').innerHTML = `
            <h5><strong>Precio</strong></h5>
            <p>${currency} ${cost}</p>
            <h5><strong>Descripcion</strong></h5>
            <p>${description}</p>
            <h5><strong>Categoria</strong></h5>
            <p>${category}</p>
            <h5><strong>Cantidad de vendidos</strong></h5>
            <p>${soldCount} vendidos</p>
            `
            for(let i = 0; i < images.length ; i++){
                if(i == 0){
                document.getElementById('img-container').innerHTML += `
                <div class="carousel-item active" style='height: 400px'>
                  <img src="${images[i]}" class="d-block w-100" alt="..." style="max-height:100%">
                </div>
                `
                document.getElementById('indicators').innerHTML += `
                <button style="width: 25%" type="button" data-bs-target="#productCarousel" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Slide ${i+1}">
                    <img src="${images[i]}" style="height: auto; object-fit: cover" class="d-block w-100" alt="...">
                </button>
                `
                } else{
                document.getElementById('img-container').innerHTML += `
                <div class="carousel-item" style='height: 400px'>
                  <img src="${images[i]}" class="d-block w-100" style="max-height:100%;"  alt="...">
                </div>
                `
                document.getElementById('indicators').innerHTML += `
                <button style="width: 25%" type="button" data-bs-target="#productCarousel" data-bs-slide-to="${i}" aria-label="Slide ${i+1}">
                    <img src="${images[i]}" style="height: auto; object-fit: cover" class="d-block w-100" alt="...">
                </button>
                `
                }

                
                
            }

            for(let relProd of relatedProducts){
                const {image, name, id} = relProd;
                relatedCont.innerHTML += `
                <div onclick="setProdID(${id})" class="card m-3 list-group-item list-group-item-action cursor-active" style="width: 25%; border: solid lightgrey 1px; padding: 0">
                    <img src="${image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">
                            ${name}
                        </p>
                    </div>
                </div>
                `
            }
            
        })
    
    getJSONData(commURL)
        .then((response) => {
            if(response.status == 'ok'){
                result = response
                return result;
                }})
        .then((result) => {
            const {data: commArray} = result;
            for(comment of commArray){
                const {dateTime, description,user} = comment
                showComment(user, dateTime, description);
            }
            
            document.querySelectorAll('.stars').forEach((comment, index) => {
                for(let i = 0; i < commArray[index].score; i++){
                    comment.children[i].classList.add('checked')
                }
            })
            if(localStorage.getItem(`${prodID}`) != null){
                document.getElementById('comment-list').innerHTML += localStorage.getItem(`${prodID}`)
            }
            
             
        })  
})

//Desafiate entrega 5
function addCart(){
    let actual = []
    localStorage.getItem('clientCart') == null ? //Checkeo si existe o no localStorage
    (actual.push(toCartS),
    localStorage.setItem('clientCart', JSON.stringify(actual)), //Si no existe, lo agrego
    toastShow()):
    (JSON.parse(localStorage.getItem('clientCart')).forEach(pr => { //Si existe lo recorro para que me quede un array plano
        actual.push(pr)
    }),
    actual.find(element => element.id == toCartS.id) == undefined ? //Verifico que el producto a agregar no este ya en el carrito
    (actual.push(toCartS),
    localStorage.setItem('clientCart', JSON.stringify(actual)),
    toastShow()):
    alreadyInCart())
}

function alreadyInCart(){
    document.getElementById('liveToast').classList.replace('bg-success', 'bg-danger');
    document.getElementById('toastBody').innerHTML = 'El producto ya existe en el carrito!'
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}
function toastShow(){
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}

function setProdID(id){
    localStorage.setItem('prodID', id)
    window.location.href = 'product-info.html'
}

function showComment(user, dateTime, description,){
    document.getElementById('comment-list').innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-start comments">
        <div class="ms-2 me-auto">
            <div>
                <span class="fw-bold user">${user}</span> - ${dateTime} -
                <span class = 'stars' >
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>     
                </span>
            </div>
            <p class='text-muted mb-0 pt-1'>${description}</p>
        </div>   
    </li>
    `
}

//Desafiate
document.getElementById("opinion").addEventListener('click', () => {
    if(checkUserComment()){
        return
    };
    let date = new Date();
	let dateFormat = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
	let timeFormat = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
	let dateTime = dateFormat+" "+timeFormat;	
    const description = document.getElementById('description');
    const puntuation = document.getElementById('punt');
    document.getElementById('comment-list').innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-start usercomments">
            <div class="ms-2 me-auto">
                <div>
                    <span class="fw-bold user">${loggedUser}</span> - ${dateTime} -
                    <span class = 'stars' > 
                        <span class="fa fa-star"></span>
                        <span class="fa fa-star"></span>
                        <span class="fa fa-star"></span>
                        <span class="fa fa-star"></span>
                        <span class="fa fa-star"></span>
                    </span>
                </div>
                <p class='text-muted mb-0 pt-1'>${description.value}</p>
            </div>   
        </li>
    `;

    for(let i = 0; i < puntuation.value; i ++){
        document.querySelectorAll('.stars')[document.querySelectorAll('.stars').length -1]
        .children[i].classList.add('checked')
    };
    description.value = '';
    puntuation.value = 1;
    toLocalS = ""
    for(let userComm of document.querySelectorAll('.usercomments')){
        toLocalS += `
        <li class="list-group-item d-flex justify-content-between align-items-start usercomments">
            ${userComm.innerHTML}
        </li>
        `
        
    }
    localStorage.setItem(`${prodID}`, toLocalS )
})

function checkUserComment() {
    let usersComment = document.querySelectorAll('.user');
    for(let user of usersComment){
        if(user.innerHTML == loggedUser){
            alert('Ya ha introducido un comentario en este producto.');
            return true;
        }
    ;}    
}


