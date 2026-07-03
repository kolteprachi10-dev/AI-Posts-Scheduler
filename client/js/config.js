const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "https://ai-posts-scheduler-production.up.railway.app"
        : "https://YOUR-RENDER-URL.onrender.com";