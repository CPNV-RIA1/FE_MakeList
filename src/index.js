const express = require('express')
const path = require('path');
const fs = require('fs');


const app = express()
const port = 3000

app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening on http://127.0.0.1:${port}`)
})