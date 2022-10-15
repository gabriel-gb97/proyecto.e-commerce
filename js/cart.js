let cartInfo = {};


document.addEventListener("DOMContentLoaded", async () =>{
    const response = await fetch(CART_INFO_URL+"25801.json")
    const result = await response.json()
    cartInfo = result.articles;
    
    JSON.parse(localStorage.getItem('clientCart')) != undefined ?
    (JSON.parse(localStorage.getItem('clientCart')).forEach(prod => {
        cartInfo.push(prod)
        
    })):
    cartInfo;

    for(prod of cartInfo){
        const {image, name, currency, unitCost, id} = prod

        tableCart.innerHTML += `
        <tr class="align-middle">
            <th scope="row"><img src="${image}" class="img-thumbnail" alt="..." style="width: 100px;"></th>
            <td>${name}</td>
            <td>${currency} ${unitCost}</td>
            <td><input id="${id}" class="form-control" type="text" style="width: 3rem" value = "1" inputmode="numeric"></td>
            <td style="width: 200px"><b>${currency}</b> <b><span>${unitCost}</b></span></td>
        </tr>
        `
    }

})

document.addEventListener('input',(e) => {
    const itemTarget = e.target.parentNode.nextElementSibling.lastChild;
    prodLine = cartInfo.find((prod) => prod.id == e.target.id);
    
    e.data == null ?
    itemTarget.innerHTML = prodLine.unitCost:
    itemTarget.innerHTML = prodLine.unitCost * parseInt(e.target.value);
})