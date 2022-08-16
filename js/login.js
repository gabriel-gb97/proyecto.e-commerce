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

}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    window.location.url('indexAfterLogin.html')
  }