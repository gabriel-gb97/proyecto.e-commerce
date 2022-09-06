const prodID = localStorage.getItem('prodID')
const url = `https://japceibal.github.io/emercado-api/products/${prodID}.json`


document.addEventListener('DOMContentLoaded', () => {
    getJSONData(url).then((response) =>{
        if(response.status == 'ok'){
            itemArray = response.data
            document.getElementById('itemName').innerHTML = itemArray.name
        }
    })
})