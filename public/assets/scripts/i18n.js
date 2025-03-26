"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initI18n();
    setupLanguageSwitcher();
});

function initI18n() {
    i18next
        .use(i18nextBrowserLanguageDetector)
        .init({
            debug: true,
            resources: {
                en: {
                    translation: {
                        greeting: "Hello, World!",
                        changeLanguageLabel: "Change language :",
                    },
                },
                fr: {
                    translation: {
                        greeting: "Bonjour, le Monde!",
                        changeLanguageLabel: "Changer langue :",
                    },
                },
                ja: {
                    translation: {
                        greeting: "こんにちわ世界!",
                        changeLanguageLabel: "言語の変更 :",
                    },
                },
            },
            detection: {
                order: ["querystring", "localStorage", "navigator", "htmlTag"],
                caches: ["localStorage"],
                lookupQuerystring: "lang",
            },
        })
        .then(() => updateLocale());
}

function setupLanguageSwitcher() {
    const languageDropdown = document.getElementById("dropdown");

    if (languageDropdown) {
        const languageOptions =
            languageDropdown.querySelectorAll("[data-lang]");

        languageOptions.forEach((option) => {
            option.addEventListener("click", () => {
                const languageCode = option.getAttribute("data-lang");
                if (languageCode) {
                    i18next.changeLanguage(languageCode, updateLocale);
                }
            });
        });
    }

    window.addEventListener("languagechange", () => {
        const browserLang = navigator.language.split("-")[0];
        i18next.changeLanguage(browserLang, updateLocale);
    });
}

function updateLocale() {
    const localize = locI18next.init(i18next);
    localize("body");

    const supportedLanguages = ["en", "fr", "ja"];
    const currentLang = i18next.language.split("-")[0];

    if (!supportedLanguages.includes(currentLang)) {
        showToast(
            `The language '${i18next.language}' could not be initialized.`
        );
        i18next.changeLanguage("en", updateLocale);
        return;
    }

    let languageSelector = document.getElementById("change-language");
    if (languageSelector) {
        var amountOfOptions = languageSelector.options.length;
        for (var i = 0; i < amountOfOptions; i++) {
            if (languageSelector.options[i].value === currentLang) {
                languageSelector.options[i].selected = true;
                break;
            }
        }
    }
}

function showToast(message) {
    Toastify({
        text: message,
        duration: 10000,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#ff4444",
        },
    }).showToast();
}
