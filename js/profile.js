import { Profile } from "./profileClass.js";

const user = new Profile(1, "Sara", "sara@mail.com", "123456");


document.getElementById("name").value = user.name;
document.getElementById("email").value = user.email;

window.updateProfile = function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    user.updateProfile({ name, email });

    document.getElementById("message").innerText =
        " Profile Updated Successfully";
};

window.changePassword = function () {
    const oldPass = document.getElementById("oldPassword").value;
    const newPass = document.getElementById("newPassword").value;

    const msg = user.changePassword(oldPass, newPass);
    document.getElementById("message").innerText = msg;
};
