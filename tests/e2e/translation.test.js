"use strict";

const { By, Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

let englishDictionary = {
    greeting: "Hello, World!",
    changeLanguageLabel: "Change language :",
};
let frenchDictionary = {
    greeting: "Bonjour, le Monde!",
    changeLanguageLabel: "Changer langue :",
};

let driver;

afterEach(async () => {
    if (driver) {
        await driver.quit();
    }
});

test("homePage_NominalCase_WebAppLanguageEnglish", async () => {
    //given
    let options = new chrome.Options();
    options.addArguments(
        "--lang=en-US",
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage"
    );
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:8081/");
    let translatedText = await driver
        .findElement(By.css('[data-i18n="greeting"]'))
        .getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("en-US");
    expect(translatedText).toEqual(englishDictionary.greeting);
});

test("homePage_NominalCase_WebAppLanguageFrench", async () => {
    //given
    let options = new chrome.Options();
    options.addArguments(
        "--lang=fr-FR",
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage"
    );
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:8081/");
    let translatedText = await driver
        .findElement(By.css('[data-i18n="greeting"]'))
        .getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("fr-FR");
    expect(translatedText).toEqual(frenchDictionary.greeting);
});

test("homePage_LanguageNotSupported_WebAppDefaultLanguage", async () => {
    //given
    let options = new chrome.Options();
    options.addArguments(
        "--lang=cs-CZ",
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage"
    );
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:8081/");
    let translatedText = await driver
        .findElement(By.css('[data-i18n="greeting"]'))
        .getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("cs-CZ");
    expect(translatedText).toEqual(englishDictionary.greeting);
});

test("homePage_LanguageNotSupported_ErrorMessagePopup", async () => {
    //given
    let options = new chrome.Options();
    options.addArguments(
        "--lang=cs-CZ",
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage"
    );
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:8081/");
    let translatedText = await driver
        .findElement(By.className("toastify"))
        .getText();
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
    let options = new chrome.Options();
    options.addArguments(
        "--lang=en-US",
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage"
    );
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:8081/");
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
    let options = new chrome.Options();
    options.addArguments(
        "--lang=es-ES",
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage"
    );
    options.set("prefs", {
        translate: {
            enabled: true,
        },
        translate_whitelists: { en: "es" },
        profile: {
            default_content_setting_values: {
                translate: 1,
            },
        },
    });

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:8081/");
    await driver.sleep(3000);

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
