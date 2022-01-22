const express = require('express')
const sqlite = require('sqlite3').verbose();



const router = express.Router()

var product;


router.get("/:id", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')

    const Review = []



    pId = req.params.id;

    db.all(`select * from PRODUCTS where Product_id = ? `, [pId], (err, row) => {

        if (err)
            console.log(err);
        else
            product = row[0];
    })


    db.all(`SELECT * FROM REVIEW R ,CUSTOMER C where C.Cust_id = R.Cust_id and R.Prdt_id = ?`, [pId], (err, row) => {

        if (err)
            console.log(err)
        else {
            let i = 0;

            row.forEach((rev) => {
                Review[i++] = rev;
            })
        }
        console.log(Review)
    })


    db.close(err => {
        if (err)
            console.log(err)
        else
            res.render("product", { Product: product, Review: Review });
    })


});

router.post("/", (req, res) => {
    const db = new sqlite.Database('./SHOP-DB');

    console.log(req.body.qid);

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
            } else res.redirect("/")
        })
});

module.exports = router;