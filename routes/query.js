const express = require('express')
const sqlite = require('sqlite3').verbose();

const router = express.Router()


router.get('/', (req, res) => {

    res.render("query");
})

module.exports = router;