import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const res = await axios({
        method: "POST",
        url: "/api/auth-login",
        data: {
            email,
            password,
        },
        });
        if (res.data.status === "success") {
        showAlert("success", "Logged in successfully!");
        window.setTimeout(() => {
            location.assign("/");
        }, 1500);
        }
    } catch (err) {
        showAlert("error", "Incorrect email or password");
    }
}
  

export const logout = async () => {
    try {
        const res = await axios({
        method: "GET",
        url: "/api/auth-logout",
        });
        if ((res.data.status = "success")) {
        window.setTimeout(() => {
            location.assign("/login");
        }, 1500);
        }
    } catch (err) {
        showAlert("error", "Error logging out! Try again.");
    }
};

