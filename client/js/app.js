// ==========================================
// AI Google Sheets Post Scheduler
// app.js
// ==========================================

const API = "http://localhost:5000";

// ===============================
// Check Login
// ===============================

const token = localStorage.getItem("token");

if (!token) {
    showToast("Please login first.");
    window.location.href = "login.html";
}

// ===============================
// Elements
// ===============================

const postForm = document.getElementById("postForm");
const aiButton = document.getElementById("generateAI");

// ===============================
// Save Post
// ===============================

postForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const platform = document.getElementById("platform").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const caption = document.getElementById("caption").value.trim();

    if (!title || !platform || !date || !time || !caption) {

        showToast("Please fill all fields.");

        return;

    }

    const postData = {

        title,
        platform,
        date,
        time,
        caption

    };

    try {

        const response = await fetch(`${API}/create-post`, {

            method: "POST",
             headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
            body: JSON.stringify(postData)

        });

        const result = await response.json();

        if (result.success) {

            showToast("✅ Post Scheduled Successfully!");

            postForm.reset();

        }

        else {

            showToast(result.message);

        }

    }

    catch (error) {

        console.error(error);

        showToast("Server Error!");

    }

});

// ===============================
// Generate AI Caption
// ===============================

aiButton.addEventListener("click", async () => {

    const title = document.getElementById("title").value.trim();
    const platform = document.getElementById("platform").value;

    if (!title) {

        showToast("Please enter a title first.");

        return;

    }

    aiButton.disabled = true;

    aiButton.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span>
        Generating...
    `;

    try {

        const response = await fetch(`${API}/generate-caption`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                title,
                platform

            })

        });

        const data = await response.json();

        if (data.success) {

            document.getElementById("caption").value = data.caption;

        }

        else {

            showToast(data.message);

        }

    }

    catch (error) {

        console.log(error);

        showToast("Unable to generate caption.");

    }

    aiButton.disabled = false;

    aiButton.innerHTML = `
        <i class="bi bi-stars"></i>
        Generate AI Caption
    `;

});