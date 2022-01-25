const express = require('express')
const sqlite = require('sqlite3').verbose();



const router = express.Router()

router.get('/', (req, res) => {

    let mt = []

    res.render('search', { Products: mt });
})

router.post('/', (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')

    let list = [];

    const searchItem = req.body.searchTxt;


    db.all(`select * from PRODUCTS 
    where Product_name = ? or Type= ?`, [searchItem, searchItem], (err, rows) => {
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