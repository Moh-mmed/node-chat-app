import axios from "axios";
import { showAlert } from "./alerts";

const signup = async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("password_confirm").value;
  try {
    const res = await axios({
      method: "POST",
      url: "/api/auth-signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/messages");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export default signup;
