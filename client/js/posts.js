const API = "http://localhost:5000";

let allPosts = [];

const modal = new bootstrap.Modal(
    document.getElementById("editModal")
);

// -------------------- LOAD POSTS --------------------
async function loadPosts() {

    try {

        const response = await fetch(`${API}/posts`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const posts = await response.json();

        allPosts = posts;

        displayPosts(posts);

    } catch (error) {
        console.log("Load posts error:", error);
    }
}

// -------------------- DISPLAY POSTS --------------------
function displayPosts(posts) {

    let html = "";

    posts.forEach(post => {

        html += `
            <tr>

                <td>${post.title}</td>
                <td>${post.platform}</td>
                <td>${post.date}</td>
                <td>${post.time}</td>

                <td>
                    <span class="badge ${post.status === "Pending" ? "bg-warning text-dark" : "bg-success"}">
                        ${post.status}
                    </span>
                </td>

                <td>
                    <button
                        class="btn btn-primary btn-sm edit-btn"
                        data-row="${post.rowNumber}">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button
                        class="btn btn-danger btn-sm delete-btn"
                        data-row="${post.rowNumber}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>

            </tr>
        `;
    });

    if (posts.length === 0) {
        html = `
            <tr>
                <td colspan="6" class="text-center">No Posts Found</td>
            </tr>
        `;
    }

    document.getElementById("postsTable").innerHTML = html;
}

// -------------------- SEARCH --------------------
document.getElementById("search").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(value) ||
        post.platform.toLowerCase().includes(value)
    );

    displayPosts(filtered);
});

// -------------------- DELETE POST --------------------
document.addEventListener("click", async (e) => {

    const button = e.target.closest(".delete-btn");

    if (!button) return;

    const rowNumber = button.dataset.row;

    const confirmDelete = confirm("Delete this post?");
    if (!confirmDelete) return;

    try {

        const response = await fetch(`${API}/delete-post/${rowNumber}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const result = await response.json();

        if (result.success) {
            loadPosts();
        }

    } catch (error) {
        console.log("Delete error:", error);
    }
});

// -------------------- OPEN EDIT MODAL --------------------
document.addEventListener("click", (e) => {

    const btn = e.target.closest(".edit-btn");
    if (!btn) return;

    const row = btn.dataset.row;

    const post = allPosts.find(p => p.rowNumber == row);

    if (!post) return;

    document.getElementById("editRow").value = row;
    document.getElementById("editTitle").value = post.title;
    document.getElementById("editPlatform").value = post.platform;
    document.getElementById("editDate").value = post.date;
    document.getElementById("editTime").value = post.time;
    document.getElementById("editCaption").value = post.caption;

    modal.show();
});

// -------------------- UPDATE POST (FIXED) --------------------
document.getElementById("updatePost")
.addEventListener("click", async () => {

    const rowNumber = document.getElementById("editRow").value;

    const data = {
        title: document.getElementById("editTitle").value,
        platform: document.getElementById("editPlatform").value,
        date: document.getElementById("editDate").value,
        time: document.getElementById("editTime").value,
        caption: document.getElementById("editCaption").value
    };

    try {

        const response = await fetch(`${API}/update-post/${rowNumber}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            modal.hide();
            loadPosts();
        } else {
            console.log("Update failed:", result);
        }

    } catch (error) {
        console.log("Update error:", error);
    }
});

// -------------------- INIT --------------------
loadPosts();