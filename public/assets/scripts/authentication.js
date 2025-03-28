"use strict";

function authentication(email, password) {
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

    return errorMessages;
}

export { authentication };
