let cartInfo = {};
const exchangeURL = 'https://cotizaciones-brou.herokuapp.com/api/currency/latest'
let exchange = [];

document.addEventListener("DOMContentLoaded", async () =>{
    
    if((localStorage.getItem('clientCart') == '[]') || (localStorage.getItem('clientCart') == undefined) ){
        const response = await fetch(CART_INFO_URL+"25801.json")
        const result = await response.json()
        cartInfo = result.articles;
        localStorage.setItem('clientCart', JSON.stringify(cartInfo));
        
    }else{
        cartInfo = JSON.parse(localStorage.getItem('clientCart'))
    }

    //Cotizaciones actualizadas para conversion de UYU
    const exchangResponse = await fetch(exchangeURL);
    exchange = await exchangResponse.json()

    showCart(cartInfo)
    calcSubT();
    document.querySelectorAll('#creditcard', '#banktransfer').forEach(input =>{
        input.checked = false
    })

})

document.addEventListener('input',(e) => {
    if(e.target.type == 'number'){
        const itemTarget = e.target.parentNode.nextElementSibling.lastChild;
        prodLine = cartInfo.find((prod) => prod.id == e.target.id);
        
        e.data == null ?
        itemTarget.innerHTML = `
            <span class='costToAdd${prodLine.currency}'>${prodLine.unitCost}</span>`:
        itemTarget.innerHTML = `
            <span class='costToAdd${prodLine.currency}'>${prodLine.unitCost * parseInt(e.target.value)}</span>`;

        calcSubT()
    }
    
})

buy.addEventListener('click', buyValidation)

function calcSubT(){
    subtotal = 0
    document.querySelectorAll(".costToAddUSD").forEach(cost => {
        subtotal += parseInt(cost.innerHTML)
    })
    document.querySelectorAll(".costToAddUYU").forEach(cost => {
        subtotal += parseInt(cost.innerHTML)/exchange.rates.USD.sell
    })
    subT.innerHTML = `USD ${subtotal.toFixed(2)}`

    shipPercent = parseFloat(document.querySelector('input[name=shipCost]:checked').value)
    shipCost = subtotal * shipPercent
    shipP.innerHTML = `USD ${shipCost.toFixed(2)}`

    total.innerHTML = `USD ${(subtotal + shipCost).toFixed(2)}`

}

function showCart(array){
    tableCart.innerHTML = ""
    for(prod of array){
        const {image, name, currency, unitCost, id} = prod

        tableCart.innerHTML += `
        <tr class="align-middle">
            <th scope="row"><img src="${image}" class="img-thumbnail" alt="..." style="width: 100px;"></th>
            <td>${name}</td>
            <td>${currency} ${unitCost}</td>
            <td><input id="${id}" class="form-control" type="number" style="width: 4rem" value = "1" inputmode="numeric"></td>
            <td style="width: 150px"><b>${currency}</b> <b><span class="costToAdd${currency}" >${unitCost}</b></span></td>
            <td class='text-center' style='width:70px'>
            <button onclick="deleteCartItem(${id})" type="button" class="btn btn-outline-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"></path>
                </svg>
            </button>
            </td>
        </tr>
        `
    }
}

function paymentMethod(){
    if(document.getElementById('creditcard').checked){
        document.querySelectorAll('.banktransfer').forEach(input => {
            input.disabled = true
        })
        document.querySelectorAll('.creditcard').forEach(input => {
            input.disabled = false
        })
        payMethod.innerHTML = 'Tarjeta de credito'
    }else{
        document.querySelectorAll('.banktransfer').forEach(input => {
            input.disabled = false
        })
        document.querySelectorAll('.creditcard').forEach(input => {
            input.disabled = true
        })
        payMethod.innerHTML = 'Transferencia bancaria'
    }
}

function buyValidation(){
    errorCounter = 0
    document.querySelectorAll('input[type=number]').forEach(input => {
        if(input.value == ""){
            errorCounter += 1
            input.classList.add('border','border-danger')
        }else{
            input.classList.remove('border','border-danger')
        }        
    })

    document.querySelectorAll('input[name=address]').forEach(input =>{
        if(input.value == ""){
            errorCounter += 1
            input.classList.add('is-invalid')
        }else{
            input.classList.remove('is-invalid')
        }
    })

    payError = 0
    document.querySelectorAll('input.creditcard, input.banktransfer').forEach(input =>{ 
        if((!input.disabled) && (input.value == '')){
            methodCont.classList.add('is-invalid')
            payError += 1
            errorCounter += 1
        }

    })
    if(payError == 0){
        methodCont.classList.remove('is-invalid')
    }

    if(errorCounter == 0){
        buyAlert.innerHTML = `
        <div class="alert alert-success alert-dismissible" role="alert" style='z-index: 100000'>
            <div>Has comprado con éxito!</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
    }

}

//Desafiate entrega 6
function deleteCartItem(id){
    actualCart = JSON.parse(localStorage.getItem('clientCart'));
    afterDelete = actualCart.filter( prod => prod.id != id);
    localStorage.setItem('clientCart', JSON.stringify(afterDelete));

    showCart(afterDelete); 
    calcSubT();
}