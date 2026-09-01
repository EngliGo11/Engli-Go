function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {
        input.type = "text";

        if (iconElement) {
            iconElement.classList.remove("fa-eye");
            iconElement.classList.add("fa-eye-slash");
        }
    } else {
        input.type = "password";

        if (iconElement) {
            iconElement.classList.remove("fa-eye-slash");
            iconElement.classList.add("fa-eye");
        }
    }
}


function handleRegister(event) {

    event.preventDefault();

    const nameInput = document.getElementById("reg-name");
    const emailInput = document.getElementById("reg-email");
    const passwordInput = document.getElementById("reg-password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

    if (!name || !email || !password || !confirmPassword) {
        showToast(
            "Por favor completa todos los campos del formulario",
            "error"
        );
        return;
    }

    if (password.length < 6) {
        showToast(
            "La contraseña debe tener al menos 6 caracteres",
            "error"
        );

        if (passwordInput) {
            passwordInput.focus();
        }

        return;
    }

    if (password !== confirmPassword) {
        showToast(
            "Las contraseñas no coinciden",
            "error"
        );

        if (confirmPasswordInput) {
            confirmPasswordInput.focus();
        }

        return;
    }

    localStorage.setItem("registeredUser", name);
    localStorage.setItem("registeredEmail", email);

    showToast(
        "¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...",
        "success"
    );

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}


function showToast(message, type = "info") {

    let toast = document.getElementById("toast");
    let toastMessage = document.getElementById("toast-message");
    let toastIcon = document.getElementById("toast-icon");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: white;
            padding: 14px 22px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            display: none;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            font-size: 0.95rem;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        `;

        toast.innerHTML = `
            <i class="fa-solid fa-circle-info" id="toast-icon"></i>
            <span id="toast-message"></span>
        `;

        document.body.appendChild(toast);

        toastMessage = document.getElementById("toast-message");
        toastIcon = document.getElementById("toast-icon");
    }

    const colors = {
        success: "#10b981",
        error: "#ef4444",
        info: "#0f172a"
    };

    const icons = {
        success: "fa-circle-check",
        error: "fa-triangle-exclamation",
        info: "fa-circle-info"
    };

    toast.style.background = colors[type] || colors.info;

    if (toastIcon) {
        toastIcon.className = `fa-solid ${icons[type] || icons.info}`;
    }

    if (toastMessage) {
        toastMessage.innerText = message;
    }

    toast.style.display = "flex";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}
 
