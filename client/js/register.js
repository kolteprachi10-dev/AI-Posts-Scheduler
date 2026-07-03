const API = "http://localhost:5000";

document
.getElementById("registerForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        password: document.getElementById("password").value

    };

    try {

        const response = await fetch(`${API}/register`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        showToast(result.message);

        if(result.success){

            window.location.href = "login.html";

        }

    }

    catch(error){

        console.log(error);

       showToast("Server Error");

    }

});