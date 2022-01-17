const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB')

const router = express.Router()

router.get("/", (req, res) => {
    const list = [];

    db.all(`select * from CUSTOMER`,
        (err, rows) => {
            if (err) res.send(err);
            else {
                let i = 0;
                rows.forEach((row) => {
                    //res.write("\ncontent:\n" + row + "\n----\n");
                    list[i++] = row;
                })
            }
        })

    db.close(err => {
        if (err) console.log(err)
        else {
            res.send(list);
        }
    })


});

module.exports = router;