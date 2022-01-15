const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB', (err) => {
    if (!err) {
        console.log("== connected to DB ==");
    }
});

const router = express.Router()


router.get("/", (req, res) => {
    res.render("product");
})

router.post("/", (req, res) => {
    const db = new sqlite.Database('./SHOP-DB');

    product = {
        $id: req.body.id,
        $shop_id: req.body.shopId,
        $name: req.body.name,
        $price: req.body.price,
        $stocks: req.body.stocks,
        $type: req.body.type,
        $brand: req.body.brand
    }

    // res.send(JSON.stringify(product));

    db.run(`insert into PRODUCTS values
    ($id,$shop_id ,$name ,$price ,$stocks,$type,$brand)`, product,
        (err) => {
            if (err) {
                res.redirect("/error");
                console.log(err);
            } else res.render("dashboard");
        })
});

module.exports = router;