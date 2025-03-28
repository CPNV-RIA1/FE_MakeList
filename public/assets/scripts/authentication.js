"use strict";

document.getElementById("loginBtn").addEventListener("click", function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
    const ul = document.getElementById("errors");

    ul.innerHTML = ""; //remove all error childs

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let errorMessages = [];
    if (!emailRegex.test(email)) {
        errorMessages.push({ i18n: "error.email_invalid" });
    }

    if (password.length < 8)
        errorMessages.push({ i18n: "error.password_length" });
    if (!/[A-Z]/.test(password))
        errorMessages.push({ i18n: "error.password_uppercase" });
    if (!/[a-z]/.test(password))
        errorMessages.push({ i18n: "error.password_lowercase" });
    if (!/[\d]/.test(password))
        errorMessages.push({ i18n: "error.password_digit" });
    if (!/[\W]/.test(password))
        errorMessages.push({ i18n: "error.password_special" });

    if (errorMessages.length > 0) {
        errorMessages.forEach((error) => {
            const li = document.createElement("li");
            li.setAttribute("data-i18n", error.i18n);
            ul.appendChild(li);
        });
        updateLocale();
        return;
    }

    message.textContent = "Login successful!";

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `userEmail=${encodeURIComponent(
        email
    )}; expires=${expiryDate.toUTCString()}; path=/`;

    // Redirect to index.html
    window.location.href = "/";
});
