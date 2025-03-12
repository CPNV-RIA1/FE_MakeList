const express = require('express')
const path = require('path');
const i18n = require('i18n');
const fs = require('fs');


const app = express()
const port = 3000

i18n.configure({
    locales: ['en', 'fr'], // List your supported languages here
    directory: path.join(__dirname, '../assets/locales'), // Directory where language files are stored
    // defaultLocale: 'en',
    queryParameter: 'lang', // Use 'lang' query parameter to change language
});

app.use(i18n.init);

app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.get('/translations', (req, res) => {
    const currentLocale = req.getLocale();
    const translations = require(`../assets/locales/${currentLocale}.json`);
    res.json(translations);
});

app.get('/translations/all', (req, res) => {
    const translations = {};

    // Read each translation file for all languages
    i18n.getLocales().forEach(locale => {
        const filePath = path.join(__dirname, '../assets/locales', `${locale}.json`);
        if (fs.existsSync(filePath)) {
            translations[locale] = require(filePath);
        }
    });

    res.json(translations);
});

app.listen(port, () => {
    console.log(`Example app listening on http://127.0.0.1:${port}`)
})