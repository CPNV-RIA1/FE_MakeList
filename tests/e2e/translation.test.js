"use strict";

const { By, Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { execSync } = require("child_process");
const { until } = require("selenium-webdriver");

execSync("npx webdriver-manager update --chrome", { stdio: "inherit" });

jest.setTimeout(10000);

let englishDictionary = {
    greeting: "Hello, World!",
    changeLanguageLabel: "Change language :",
};
let frenchDictionary = {
    greeting: "Bonjour, le Monde!",
    changeLanguageLabel: "Changer langue :",
};

let driver;

async function setupDriver(language, prefs = {}) {
    let options = new chrome.Options();
    options.addArguments(
        `--lang=${language}`,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage"
    );

    if (Object.keys(prefs).length > 0) {
        options.setUserPreferences(prefs);
    }

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
}

afterEach(async () => {
    if (driver) {
        await driver.quit();
    }
});

test("homePage_NominalCase_WebAppLanguageEnglish", async () => {
    //given
    await setupDriver("en-US");
    await driver.get("http://127.0.0.1:8081/");

    //when
    const greeting = await driver.wait(
        until.elementLocated(By.css('[data-i18n="greeting"]')),
        10000
    );
    let translatedText = await greeting.getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("en-US");
    expect(translatedText).toEqual(englishDictionary.greeting);
});

test("homePage_NominalCase_WebAppLanguageFrench", async () => {
    //given
    await setupDriver("fr-FR");
    await driver.get("http://127.0.0.1:8081/");

    //when
    const greeting = await driver.wait(
        until.elementLocated(By.css('[data-i18n="greeting"]')),
        10000
    );
    let translatedText = await greeting.getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("fr-FR");
    expect(translatedText).toEqual(frenchDictionary.greeting);
});

test("homePage_LanguageNotSupported_WebAppDefaultLanguage", async () => {
    //given
    await setupDriver("cs-CZ");
    await driver.get("http://127.0.0.1:8081/");

    //when
    const greeting = await driver.wait(
        until.elementLocated(By.css('[data-i18n="greeting"]')),
        10000
    );
    let translatedText = await greeting.getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("cs-CZ");
    expect(translatedText).toEqual(englishDictionary.greeting);
});

test("homePage_LanguageNotSupported_ErrorMessagePopup", async () => {
    //given
    await setupDriver("cs-CZ");
    await driver.get("http://127.0.0.1:8081/");

    //when
    const toast = await driver.wait(
        until.elementLocated(By.className("toastify")),
        10000
    );
    let translatedText = await toast.getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("cs-CZ");
    expect(translatedText).toEqual(
        `The language '${language}' could not be initialized.`
    );
});

test("homePage_NomincalCase_SwitchLanguageViaDropdown", async () => {
    //given
    await setupDriver("en-US");
    await driver.get("http://127.0.0.1:8081/");

    //when
    let frenchOption = await driver.findElement(
        By.css('#change-language option[value="fr"]')
    );
    let translatedTextBefore = await driver
        .findElement(By.css('[data-i18n="greeting"]'))
        .getText();
    await frenchOption.click();
    let translatedTextAfter = await driver
        .findElement(By.css('[data-i18n="greeting"]'))
        .getText();

    //then
    expect(translatedTextBefore).toEqual(englishDictionary.greeting);
    expect(translatedTextAfter).toEqual(frenchDictionary.greeting);
});

test("homePage_AutoTranslate_ExcludeCertainElements", async () => {
    //given
    await setupDriver("es-ES", {
        translate: { enabled: true },
        translate_whitelists: { en: "es" },
        profile: {
            default_content_setting_values: { translate: 1 },
        },
    });
    await driver.get("http://127.0.0.1:8081/");
    await driver.sleep(3000);

    //when
    let translatedText = await driver
        .findElement(By.css('[data-i18n="greeting"]'))
        .getText();
    let excludedElementText = await driver
        .findElement(By.id("brand-name"))
        .getText();

    //then
    expect(translatedText).toEqual("¡Hola Mundo!");
    expect(excludedElementText).toEqual("TierlistApp");
});
