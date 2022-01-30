const express = require('express')
const sqlite = require('sqlite3').verbose();



const router = express.Router()

router.get("/:id", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')
    let shopList = []

    let pid = req.params.id;

    console.log(pid, "is the sent pid")

    db.all(`SELECT * FROM SHOP s, PRODUCTS p
    where p.Shop_id = ( select Shop_id 
                     from SHOP) and Product_id = ?;`, [pid],
        (err, rows) => {
            if (err) console.log(err);
            else {
                let i = 0;
                rows.forEach((row) => {
                    shopList[i++] = row;
                    console.log(shopList[0].Product_name);

                });

            }

        });


    db.close(err => {
        if (err) console.log(err)
        else {
            res.render("shop", { Angadi: shopList })
        }
    })

    shopList = []


});

router.post("/add", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')

    shop = {
        $id: req.body.id,
        $name: req.body.name,
        $loc: req.body.loc,
        $phone: req.body.phone,
        $email: req.body.email
    }

    console.log("Entered name is : " + req.body.name);

    // res.send(JSON.stringify(shop));

    db.run(`insert into SHOP (Shop_name,Shop_loc,Phone,Email) values
    ($name ,$loc ,$phone ,$email)`, shop,
        (err) => {
            if (err) res.render('error', { Error: err });
            else res.redirect("/")
        })

});

module.exports = router;