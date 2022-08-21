const formLogin = document.getElementById('formLogin')
formLogin.addEventListener('submit', checkForm)

function checkForm(e){
    let inputs = document.querySelectorAll('input')
    inputs.forEach(i => {
        if(i.value == ''){
            i.classList.add('is-invalid')
        }else{
            i.classList.remove('is-invalid')
        }
    });
    for(let i of inputs){
        if(i.value == '')
        return false
    }
    localStorage.setItem('login', true)

}

function callback(){
    localStorage.setItem('login', true)
    window.location.href = "https://gabriel-gb97.github.io/proyecto.e-commerce/indexAfterLogin.html?"
}