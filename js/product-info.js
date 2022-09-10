const prodID = localStorage.getItem('prodID')
const URL = `https://japceibal.github.io/emercado-api/products/${prodID}.json`
const commURL = `https://japceibal.github.io/emercado-api/products_comments/${prodID}.json`


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
            const { category, cost, 
                    currency, description, 
                    images, name, soldCount } = itemArray
            document.getElementById('itemName').innerHTML = name
            document.getElementById('item-cont').innerHTML = `
            <h5><strong>Precio</strong></h5>
            <p>${currency} 2400</p>
            <h5><strong>Descripcion</strong></h5>
            <p>${description} ${cost}</p>
            <h5><strong>Categoria</strong></h5>
            <p>${category}</p>
            <h5><strong>Cantidad de vendidos</strong></h5>
            <p>${soldCount} vendidos</p>
            <h5 class="pb-1"><strong>Imagenes ilustrativas</strong></h5>
            <div class="row pt-2" id='img-container'>
            </div>
            `
            for(let i = 0; i < images.length ; i++){
                document.getElementById('img-container').innerHTML += `
                <div class="card" style="width: 25%;">
                <img src="${images[i]}" class="card-img img-thumbnail" alt="...">
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
        })  
})

function showComment(user, dateTime, description){
    document.getElementById('comment-list').innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
        <div>
            <span class="fw-bold">${user}</span> - ${dateTime} -
            <span class = 'stars'> 
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
    let user = localStorage.getItem('regEmail').split('@')[0]
    let date = new Date();
	let dateFormat = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
	let timeFormat = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
	let dateTime = dateFormat+" "+timeFormat;	
    const description = document.getElementById('description').value;
    const puntuation = document.getElementById('punt').value;
    document.getElementById('comment-list').innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div>
                    <span class="fw-bold">${user}</span> - ${dateTime} -
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

    for(let i = 0; i < puntuation; i ++){
        document.querySelectorAll('.stars')[document.querySelectorAll('.stars').length -1]
        .children[i].classList.add('checked')
    }
})

