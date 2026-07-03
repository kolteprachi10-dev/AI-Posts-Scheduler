function showToast(message, type = "success") {

    let background;

    switch (type) {
        case "success":
            background = "#28a745";
            break;

        case "error":
            background = "#dc3545";
            break;

        case "warning":
            background = "#ffc107";
            break;

        default:
            background = "#007bff";
    }

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        stopOnFocus: true,
        style: {
            background: background,
            borderRadius: "8px"
        }
    }).showToast();
}