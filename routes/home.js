const express = require('express')
const sqlite = require('sqlite3').verbose();

const router = express.Router()



router.get("/", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')
        //get product list 
    let list = [];

    db.all(`select * from PRODUCTS`,
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
            res.render("home", { Products: list });
            // res.send(list)
        }
    })

    // list = [];


    // res.render('home');
})

module.exports = router