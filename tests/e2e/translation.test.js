"use strict";

const { By, Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

let englishDictionary = {
    greeting: "Hello, World!",
    change_language: "Change Language",
};
let frenchDictionary = {
    greeting: "Bonjour !",
    change_language: "Changer Langue",
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
    options.addArguments("--lang=en-US");
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:3000/");
    let translatedText = await driver.findElement(By.id("greeting")).getText();
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
    options.addArguments("--lang=fr-FR");
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:3000/");
    let translatedText = await driver.findElement(By.id("greeting")).getText();
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
    options.addArguments("--lang=cs-CZ");
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:3000/");
    let translatedText = await driver.findElement(By.id("greeting")).getText();
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
    options.addArguments("--lang=cs-CZ");
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:3000/");
    let translatedText = await driver
        .findElement(By.id("error-message"))
        .getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("cs-CZ");
    expect(translatedText).toEqual("The browser language is not supported.");
});

test("homePage_NomincalCase_SwitchLanguageViaDropdown", async () => {
    //given
    let options = new chrome.Options();
    options.addArguments("--lang=en-US");
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:3000/");
    let translatedTextBefore = await driver
        .findElement(By.id("greeting"))
        .getText();
    await driver.findElement(By.id("fr")).click();
    let translatedTextAfter = await driver
        .findElement(By.id("greeting"))
        .getText();

    //then
    expect(translatedTextBefore).toEqual(englishDictionary.greeting);
    expect(translatedTextAfter).toEqual(frenchDictionary.greeting);
});

test("homePage_AutoTranslate_ExcludeCertainElements", async () => {
    //given
    let options = new chrome.Options();
    options.addArguments("--lang=es-ES");
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
    await driver.get("http://127.0.0.1:3000/");
    await driver.sleep(3000);

    let translatedText = await driver.findElement(By.id("greeting")).getText();
    let excludedElementText = await driver
        .findElement(By.id("brand-name"))
        .getText();

    //then
    expect(translatedText).toEqual("¡Hola Mundo!");
    expect(excludedElementText).toEqual("TierlistApp");
});
