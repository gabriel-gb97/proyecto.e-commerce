const prodID = localStorage.getItem('prodID')
const url = `https://japceibal.github.io/emercado-api/products/${prodID}.json`
const commUrl = `https://japceibal.github.io/emercado-api/products_comments/${prodID}.json`


document.addEventListener('DOMContentLoaded', () => {
    getJSONData(url).then((response) =>{
        if(response.status == 'ok'){
            itemArray = response.data
            document.getElementById('itemName').innerHTML = itemArray.name
            document.getElementById('item-cont').innerHTML = `
            <h5><strong>Precio</strong></h5>
            <p>${itemArray.currency} 2400</p>
            <h5><strong>Descripcion</strong></h5>
            <p>${itemArray.description} ${itemArray.cost}</p>
            <h5><strong>Categoria</strong></h5>
            <p>${itemArray.category}</p>
            <h5><strong>Cantidad de vendidos</strong></h5>
            <p>${itemArray.soldCount} vendidos</p>
            <h5 class="pb-1"><strong>Imagenes ilustrativas</strong></h5>
            <div class="row pt-2" id='img-container'>
            </div>
            `
            for(let i = 0; i < itemArray.images.length ; i++){
                document.getElementById('img-container').innerHTML += `
                <div class="card" style="width: 25%;">
                <img src="${itemArray.images[i]}" class="card-img img-thumbnail" alt="...">
                `
            }
        }
    
    getJSONData(commUrl).then((response) => {
        if(response.status == 'ok'){
            commArray = response.data
            for(let i = 0;i < commArray.length; i ++){
                document.getElementById('comment-list').innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div>
                            <span class="fw-bold">${commArray[i].user}</span> - ${commArray[i].dateTime} -
                            <span class = 'stars'> 
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                            </span>
                        </div>
                        <p class='text-muted mb-0 pt-1'>${commArray[i].description}</p>
                    </div>   
                    </li>
                `
               
            }

            document.querySelectorAll('.stars').forEach((comment, index) => {
                for(let i = 0; i < commArray[index].score; i++){
                    comment.children[i].classList.add('checked')
                }
            })
                
        }
    })
    })
})


