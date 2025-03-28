"use strict";

import { authentication } from "./authentication.js";

document.getElementById("loginBtn").addEventListener("click", function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
    const ul = document.getElementById("errors");

    ul.innerHTML = ""; // remove all error children

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

    message.textContent = "Login successful!";

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `userEmail=${encodeURIComponent(
        email
    )}; expires=${expiryDate.toUTCString()}; path=/`;

    // Redirect to index.html
    window.location.href = "/";
});
