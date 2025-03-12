"use strict";

const { By, Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

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
    let translatedText = await driver.findElement(By.id("title")).getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("en-US");
    expect(translatedText).toEqual("Public Tierlists");
});

test("homePage_NominalCase_WebAppLanguageJapanese", async () => {
    //given
    let options = new chrome.Options();
    options.addArguments("--lang=ja-JP");
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    //when
    await driver.get("http://127.0.0.1:3000/");
    let translatedText = await driver.findElement(By.id("title")).getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("ja");
    expect(translatedText).toEqual("公共ティアリスト");
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
    let translatedText = await driver.findElement(By.id("title")).getText();
    let language = await driver.executeScript(
        "return navigator.language || navigator.userLanguage;"
    );

    //then
    expect(language).toEqual("cs-CZ");
    expect(translatedText).toEqual("Public Tierlists");
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
        .findElement(By.id("title"))
        .getText();
    await driver.findElement(By.id("jp")).click();
    let translatedTextAfter = await driver
        .findElement(By.id("title"))
        .getText();

    //then
    expect(translatedTextBefore).toEqual("Public Tierlists");
    expect(translatedTextAfter).toEqual("公共ティアリスト");
});
