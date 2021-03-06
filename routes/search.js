const express = require('express')
const sqlite = require('sqlite3').verbose();



const router = express.Router()

router.get('/', (req, res) => {

    let emt = []

    res.render('search', { Products: emt });
})

router.post('/', (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')

    let list = [];

    const searchItem = req.body.searchTxt + "%";

    let sql = `select * from PRODUCTS where Product_name like '${searchItem}' or Type like '${searchItem}'`;
    console.log("Requested search query :" + searchItem);



    db.all(sql, [], (err, rows) => {
        if (err) console.log(err);
        else {
            let i = 0;
            rows.forEach((row) => {
                list[i++] = row;
            })
        }
    })


    db.close(err => {
        if (err) console.log(err)
        else {
            res.render("search", { Products: list });
        }
    })

});



module.exports = router;