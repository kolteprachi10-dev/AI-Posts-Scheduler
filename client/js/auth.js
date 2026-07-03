// =========================
// AUTH CHECK
// =========================

const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {

    window.location.href = "login.html";

}

// =========================
// USER NAME
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const username = document.getElementById("username");

    if (username) {

        username.innerText = user.name;

    }

});

// =========================
// LOGOUT
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            if(confirm("Are you sure you want to logout?")){

                localStorage.removeItem("token");

                localStorage.removeItem("user");

                window.location.href = "login.html";

            }

        });

    }

});

// =========================
// DARK MODE
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("themeToggle");

    if(toggle){

        toggle.addEventListener("click",()=>{

            document.body.classList.toggle("light-mode");

            localStorage.setItem(

                "theme",

                document.body.classList.contains("light-mode")

                ? "light"

                : "dark"

            );

        });

    }

    if(localStorage.getItem("theme")=="light"){

        document.body.classList.add("light-mode");

    }

});