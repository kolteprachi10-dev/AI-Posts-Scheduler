const API = "http://localhost:5000";



document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {

        email: document.getElementById("email").value,

        password: document.getElementById("password").value

    };

    try {

        const response = await fetch(`${API}/login`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

            const result = await response.json();

            console.log("LOGIN RESPONSE:", result);

            if (!result.success) {
                console.error(result.message);
                return;
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            console.log("Saved Token:", localStorage.getItem("token"));

            window.location.href = "dashboard.html";

    }

    catch (error) {

        console.log(error);

        showToast("Server Error");

    }

});