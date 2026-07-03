const API = "http://localhost:5000";

// ===============================
// LOAD DASHBOARD
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

async function loadDashboard() {

    try {

        const response = await fetch(`${API}/posts`, {
           headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          });;

        const posts = await response.json();

        if (!Array.isArray(posts)) {

            console.log(posts);

            return;

        }

        updateDashboard(posts);

    }

    catch (error) {

        console.error(error);

    }

}

// ===============================
// UPDATE DASHBOARD
// ===============================

function updateDashboard(posts) {

    const table = document.getElementById("dashboardPosts");

    const total = document.getElementById("totalPosts");

    const pending = document.getElementById("pendingPosts");

    const published = document.getElementById("publishedPosts");

    total.innerText = posts.length;

    let pendingCount = 0;
    let publishedCount = 0;

    table.innerHTML = "";

    if (posts.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="4" class="text-center">

                    No Posts Found

                </td>

            </tr>

        `;

        pending.innerText = 0;

        published.innerText = 0;

        return;

    }

    // Latest 5 Posts
    const latestPosts = posts.slice(-5).reverse();

    latestPosts.forEach(post => {

        if ((post.status || "").toLowerCase() === "pending") {

            pendingCount++;

        }

        if ((post.status || "").toLowerCase() === "published") {

            publishedCount++;

        }

        table.innerHTML += `

            <tr>

                <td>${post.title}</td>

                <td>${post.platform}</td>

                <td>${post.date}</td>

                <td>

                    <span class="${badgeClass(post.status)}">

                        ${post.status}

                    </span>

                </td>

            </tr>

        `;

    });

    pending.innerText = pendingCount;

    published.innerText = publishedCount;

}

// ===============================
// BADGE COLOR
// ===============================

function badgeClass(status) {

    status = (status || "").toLowerCase();

    if (status === "pending") {

        return "badge bg-warning text-dark";

    }

    if (status === "published") {

        return "badge bg-success";

    }

    if (status === "deleted") {

        return "badge bg-danger";

    }

    return "badge bg-secondary";

}

async function loadUser() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("username").textContent = data.name;
        } else {
            console.log(data.message);
        }

    } catch (err) {
        console.error(err);
    }
}

loadUser();