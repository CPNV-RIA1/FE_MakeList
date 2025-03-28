"use strict";

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}


document.getElementById("loginBtn").addEventListener("click", function (event) {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
    const ul = document.getElementById("errors");

    ul.innerHTML = ""; //remove all error childs

    event.preventDefault();

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

    hashPassword(password).then((hashedPassword) => {
        fetch("assets/accounts.json")
            .then((res) => res.json())
            .then((accounts) => {
                const user = accounts.find(acc => acc.email === email && acc.passwordHash === hashedPassword);
                if (user) {
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 7);
                    document.cookie = `userEmail=${encodeURIComponent(email)}; expires=${expiryDate.toUTCString()}; path=/`;
                    window.location.href = "/";
                } else {
                    const li = document.createElement("li");
                    li.setAttribute("data-i18n", "error.login_invalid");
                    ul.appendChild(li);
                    updateLocale();
                }
            })
            .catch((error) => {
                console.error("Error loading accounts:", error);
                const li = document.createElement("li");
                li.setAttribute("data-i18n", "noAccountsFound");
                ul.appendChild(li);
            });
    });
});
