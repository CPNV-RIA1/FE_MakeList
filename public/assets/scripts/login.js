"use strict";

import { authentication, hashPassword } from "./authentication.js";

document.getElementById("loginBtn").addEventListener("click", function (event) {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
    const ul = document.getElementById("errors");

    ul.innerHTML = ""; // remove all error children

    event.preventDefault();

    const errorMessages = authentication(email, password);

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
                    window.location.href = "./index.html";
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
