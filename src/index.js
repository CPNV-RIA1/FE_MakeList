const express = require('express')
const path = require('path');
const fs = require('fs');


const app = express()
const port = 3000

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