const email = document.getElementById('e-mail');
const form = document.getElementById('profileForm');
let savedProfile = JSON.parse(localStorage.getItem('profileData'));

if (savedProfile != null) {
    showProfileData(savedProfile);
}

document.addEventListener('input', () => {
    form.checkValidity() ?
        (saveChanges.disabled = false, formFields.classList.remove('is-invalid')) :
        (saveChanges.disabled = true, formFields.classList.add('is-invalid'));
})

email.value = localStorage.getItem('regEmail')

form.addEventListener('submit', (e) => {
    if (savedProfile != null) {
        profileToSave = modifyProfile();
    } else {
        profileToSave = newTimeProfile();
    };

    localStorage.setItem('profileData', JSON.stringify(profileToSave))
    showProfileData(profileToSave);
    saveChanges.disabled = true;
    madeChanges.innerHTML = `
        <div class="alert alert-success alert-dismissible" role="alert" style='z-index: 100000'>
            <div>Cambios guardados correctamente.</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
    e.preventDefault();

})


function showProfileData(object) {
    document.querySelectorAll('.form-control').forEach(input => {
        if (input.id != 'profileImg') {
            input.value = object[input.id]
        };
    });
    document.getElementById('profilePic').setAttribute('src', object.imgURL);
}

function newTimeProfile() {
    let imgReaderUrl = '';
    if (profileImg.files[0]) {
        const reader = new FileReader()
        reader.readAsDataURL(profileImg.files[0]);
        imgReaderUrl = reader.result
        profileImg.value = ""
    };
    let userProfile = {
        imgURL: imgReaderUrl ? imgReaderUrl : null,
    };

    document.querySelectorAll('.form-control').forEach(input => {
        if (input.id != 'profileImg') {
            userProfile[input.id] = input.value
        }
    });

    return userProfile
}

function modifyProfile() {
    let profileModifyied = newTimeProfile();

    Object.keys(profileModifyied).forEach(key => {
        if (key != 'imgURL') {
            savedProfile[key] = profileModifyied[key]
        } else {
            profileModifyied[key] != null ? savedProfile[key] = profileModifyied[key] : savedProfile[key]
        }
    });
    return savedProfile
}
