const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB')

const router = express.Router()

router.get("/", (req, res) => {
    res.render("shop")
});

router.post("/add", (req, res) => {
    shop = {
        $id: req.body.id,
        $name: req.body.name,
        $loc: req.body.loc,
        $phone: req.body.phone,
        $email: req.body.email
    }

    // res.send(JSON.stringify(shop));

    db.run(`insert into SHOP values
    ($id ,$name ,$loc ,$phone ,$email)`, shop,
        (err) => {
            if (err) res.redirect('/error');
            else res.redirect("/")
        })

})

module.exports = router;