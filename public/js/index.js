
// import { updateSettings } from "./updateSettings";
// import { bookTour } from "./stripe";
// import { showAlert } from "./alerts";
// DOM ELEMENTS
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");

const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, time * 1000);
};



if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            const res = await axios({
              method: "POST",
              url: "http://127.0.0.1:8080/auth-login",
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
    });
}

if (signupForm)
    signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password_confirm").value;
    try {
    const res = await axios({
        method: "POST",
        url: "http://127.0.0.1:8080/auth-signup",
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
});

if (logOutBtn) {

    const logout = async () => {
        try {
            const res = await axios({
            method: "GET",
            url: "http://127.0.0.1:8080/auth-logout",
            });
          if ((res.data.status = "success")) {
              window.setTimeout(() => {
                location.assign("/login");
              }, 1500);
            }
        } catch (err) {
            showAlert("error", "Error logging out! Try again.");
        }
    }

    logOutBtn.addEventListener("click", logout);
    
}


const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 10);
