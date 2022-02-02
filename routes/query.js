const express = require('express')
const sqlite = require('sqlite3').verbose();

const router = express.Router()



router.get('/', (req, res) => {
    list = [];

    res.render('query', { Response: list })
})

router.post('/', (req, res) => {

    const db = new sqlite.Database('./SHOP-DB');

    let list = [];

    const Q = req.body.query;

    console.log("Entered Query : " + Q);


    db.all(Q, [], (err, rows) => {
        if (err) list[0] = err;
        else {
            let i = 0;
            rows.forEach((row) => {
                list[i++] = row;
            });
        }
    });

    db.close((err) => {
        err ? console.log("error in closing db") : res.render('query', { Response: list })
    })


})

module.exports = router;