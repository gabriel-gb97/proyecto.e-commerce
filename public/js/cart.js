let cartInfo = {};
const exchangeURL = 'https://cotizaciones-brou.herokuapp.com/api/currency/latest'
let exchange = [];

document.addEventListener("DOMContentLoaded", async () => {

    if ((localStorage.getItem('clientCart') == '[]') || (localStorage.getItem('clientCart') == undefined)) {
        const response = await fetch(CART_INFO_URL)
        const result = await response.json()
        cartInfo = result.articles;
        localStorage.setItem('clientCart', JSON.stringify(cartInfo));

    } else {
        cartInfo = JSON.parse(localStorage.getItem('clientCart'))
    }

    //Cotizaciones actualizadas para conversion de UYU
    const exchangeResponse = await fetch(exchangeURL);
    exchange = await exchangeResponse.json()

    showCart(cartInfo)
    calcSubT();
    document.querySelectorAll('#creditcard', '#banktransfer').forEach(input => {
        input.checked = false
    });

})

document.addEventListener('input', (e) => {
    if (e.target.type == 'number') {
        const itemTarget = e.target.parentNode.nextElementSibling.lastChild;
        prodLine = cartInfo.find((prod) => prod.id == e.target.id);

        //Despues de grabar y al probar en chrome vi que no trae el atributo del event.data
        //Yo trabajo con mozilla y no me pasaba, entonces lo cambie por e.target.value
        //e.data == null ?
        e.target.value == null ?
            itemTarget.innerHTML = `
            <span class='costToAdd${prodLine.currency}'>${prodLine.unitCost}</span>` :
            itemTarget.innerHTML = `
            <span class='costToAdd${prodLine.currency}'>${prodLine.unitCost * parseInt(e.target.value)}</span>`;

        calcSubT()
    }

})

buy.addEventListener('click', buyValidation)

function calcSubT() {
    subtotal = 0
    document.querySelectorAll(".costToAddUSD").forEach(cost => {
        subtotal += parseInt(cost.innerHTML)
    })
    document.querySelectorAll(".costToAddUYU").forEach(cost => {
        subtotal += parseInt(cost.innerHTML) / exchange.rates.USD.sell
    })
    subT.innerHTML = `USD ${(Math.round(subtotal * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    shipPercent = parseFloat(document.querySelector('input[name=shipCost]:checked').value)
    shipCost = subtotal * shipPercent
    shipP.innerHTML = `USD ${(Math.round(shipCost * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    totalPrice = subtotal + shipCost
    total.innerHTML = `USD ${(Math.round(totalPrice * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

}

function showCart(array) {
    tableCart.innerHTML = ""
    for (prod of array) {
        const { image, name, currency, unitCost, id } = prod

        tableCart.innerHTML += `
        <tr class="align-middle cart-item">
            <th scope="row"><img src="${image}" class="img-responsive" alt="..." style="width: 100px;"></th>
            <td>
                ${name}
            </td>
            <td>
                ${currency} ${unitCost}
            </td>
            <td>
                <input id="${id}" class="form-control" type="number" style="width: 4rem" min='0' value = "1" inputmode="numeric">
            </td>
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

function paymentMethod() {
    if (document.getElementById('creditcard').checked) {
        document.querySelectorAll('input[type=text].banktransfer').forEach(input => {
            input.disabled = true
        })
        document.querySelectorAll('input[type=text].creditcard').forEach(input => {
            input.disabled = false
        })
        payMethod.innerHTML = 'Tarjeta de credito'
    } else {
        document.querySelectorAll('input[type=text].banktransfer').forEach(input => {
            input.disabled = false
        })
        document.querySelectorAll('input[type=text].creditcard').forEach(input => {
            input.disabled = true
        })
        payMethod.innerHTML = 'Transferencia bancaria'
    }
}


function quantityValidation() {
    error = 0
    document.querySelectorAll('input[type=number]').forEach(input => {
        if ((input.value == "") || (parseInt(input.value) <= 0)) {
            error += 1
            input.classList.add('border', 'border-danger')
        } else {
            input.classList.remove('border', 'border-danger')
        }
    })

    return (error == 0 ? (itemTable.classList.remove('is-invalid'), true) :
        (itemTable.classList.add('is-invalid'), false))
}

function addressValidation() {
    error = 0
    document.querySelectorAll('input[name=address]').forEach(input => {
        if (input.value.trim() == "") {
            error += 1
            input.classList.add('is-invalid')
        } else {
            input.classList.remove('is-invalid')
        }
    })

    return (error == 0)
}

function shipValidation() {
    const shipButtons = document.getElementsByName('shipCost')
    for (let i = 0; i < shipButtons.length; i++) {
        if (shipButtons[i].checked) {
            shipPreferences.classList.remove('is-invalid')
            return true
        } else {
            shipPreferences.classList.add('is-invalid')
        }
    }
    return false
}

function paymentValidation() {
    error = 0
    document.querySelectorAll('input.creditcard, input.banktransfer').forEach(input => {
        if ((!input.disabled) && (input.value == '')) {
            methodCont.classList.add('is-invalid')
            error += 1
        }

    })

    return (error == 0 ? (methodCont.classList.remove('is-invalid'), true) :
        false)


}

async function buyValidation() {
    //Caso que se hayan eliminado todos los articulos del carrito y se clickee el boton de finalizar compra
    if (document.getElementById('tableCart').childElementCount == 0) {
        buyAlert.innerHTML = `
        <div class="alert alert-danger alert-dismissible" role="alert" style='z-index: 100000'>
            <div>Debe tener al menos un articulo en el carrito para poder comprar!</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
        return
    }

    quantity = quantityValidation()
    address = addressValidation()
    ship = shipValidation()
    payment = paymentValidation()
    if ((quantity) && (address) && (ship) && (payment)) {
        buyAlert.innerHTML = `
        <div class="alert alert-success alert-dismissible" role="alert" style='z-index: 100000'>
            <div>Has comprado con éxito!</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
        cartToSave = saveCart();
        //Push de la compra
        await fetch('http://localhost:3000/buy_cart', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(cartToSave)
        })

        //Limpieza del formulario y el carrito
        document.querySelectorAll('input').forEach(input => {
            input.value = ''
        })

        localStorage.removeItem('clientCart')
        showCart([])
    }
}

//Desafiate entrega 6
function deleteCartItem(id) {
    actualCart = JSON.parse(localStorage.getItem('clientCart'));
    afterDelete = actualCart.filter(prod => prod.id != id);
    localStorage.setItem('clientCart', JSON.stringify(afterDelete));

    showCart(afterDelete);
    calcSubT();
}

//Desafiate entrega 8
function saveCart() {
    const cartToSave = {
        products: [],
        typeOfShipment: "",
        addressInfo: {},
        selectedPayment: {},
        totalPurchase: 0
    }

    document.querySelectorAll('.cart-item').forEach(item => {
        cartToSave.products.push({
            prodID: item.cells[3].children[0].id,
            quantity: item.cells[3].children[0].value
        })
    })

    document.querySelectorAll('input[name=shipCost]').forEach(input => {
        if (input.checked) {
            cartToSave.typeOfShipment = input.id
        }
    })

    document.querySelectorAll('input[name=address]').forEach(element => {
        cartToSave.addressInfo[element.id] = element.value
    })

    document.querySelectorAll('input[name=paymethod]').forEach(payment => {
        if (payment.checked) {
            toAppend = {}
            document.querySelectorAll(`input[type=text].${payment.id}`).forEach(payInfo => {
                toAppend[payInfo.name] = payInfo.value
            })
            cartToSave.selectedPayment[payment.id] = toAppend
        }
    })

    cartToSave.totalPurchase = parseFloat(total.innerText.split(' ')[1].replace(',', '').replace('.', ','))

    return cartToSave

}