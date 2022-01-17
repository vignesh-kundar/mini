const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB')

const router = express.Router()

router.get('/', (req, res) => {

    res.render('search');
})

router.post('/', (req, res) => {

    const searchItem = req.body.searchTxt;
    res.send(searchItem);
})

module.exports = router;