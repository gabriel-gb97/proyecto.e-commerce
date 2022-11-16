const email = document.getElementById("e-mail");
email.value = localStorage.getItem("regEmail");
const form = document.getElementById("profileForm");
let savedProfile = JSON.parse(localStorage.getItem(email.value));
let imgReaderUrl = "";
let reader = new FileReader();

if (savedProfile != null) {
    showProfileData(savedProfile);
}

document.addEventListener("input", () => {
    form.checkValidity()
        ? ((saveChanges.disabled = false),
            formFields.classList.remove("is-invalid"))
        : ((saveChanges.disabled = true), formFields.classList.add("is-invalid"));
});



form.addEventListener("submit", (e) => {
    if (savedProfile != null) {
        profileToSave = modifyProfile();
    } else {
        profileToSave = newTimeProfile();
    }

    localStorage.setItem(email.value, JSON.stringify(profileToSave));
    showProfileData(profileToSave);
    profileImg.value = "";
    saveChanges.disabled = true;
    madeChanges.innerHTML = `
        <div class="alert alert-success alert-dismissible" role="alert" style='z-index: 100000'>
            <div>Cambios guardados correctamente.</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;
    e.preventDefault();
    form.classList.add('was-validated')
});

function showProfileData(object) {
    document.querySelectorAll(".form-control").forEach((input) => {
        if (input.id != "profileImg") {
            input.value = object[input.id];
        }
    });
    document.getElementById("profilePic").src = object.imgURL;
}

function newTimeProfile() {
    let userProfile = {
        imgURL: imgReaderUrl ? imgReaderUrl : 'img/img_perfil.png',
    };

    document.querySelectorAll(".form-control").forEach((input) => {
        if (input.id != "profileImg") {
            userProfile[input.id] = input.value;
        }
    });

    return userProfile;
}

function modifyProfile() {
    let profileModifyied = newTimeProfile();

    Object.keys(profileModifyied).forEach((key) => {
        if (key != "imgURL") {
            savedProfile[key] = profileModifyied[key];
        } else {
            profileModifyied[key] != null
                ? (savedProfile[key] = profileModifyied[key])
                : savedProfile[key];
        }
    });
    return savedProfile;
}

async function readIMG() {
    const file = document.querySelector("input[type=file]").files[0];
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
        imgReaderUrl = reader.result;
    });
}
