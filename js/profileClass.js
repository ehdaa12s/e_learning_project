export class Profile {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    updateProfile(data) {
        if (data.name) this.name = data.name;
        if (data.email) this.email = data.email;
    }

    changePassword(oldPass, newPass) {
        if (oldPass !== this.password)
            return "Old password is wrong";

        if (newPass.length < 6)
            return "Password must be at least 6 chars";

        this.password = newPass;
        return "Password updated successfully";
    }
}
