const express = require('express')
const sqlite = require('sqlite3').verbose();

const router = express.Router()

var date = new Date().toISOString().split("T")[0];


router.get("/:buynowId", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB');

    let product = {};

    pdId = req.params.buynowId;
    console.log("Params is : " + pdId);

    db.all(`select * from PRODUCTS where Product_id = ?`, [pdId], (err, result) => {
        if (err) throw err;
        else {
            product = result[0];
            console.log(product);
        }
    })

    console.log(product);

    db.close(err => {
        if (err) console.log(err)
        else {
            res.render('buynow', { Date: date, Product: product });
            // res.send(list)
        }
    })

});


router.post("/", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB');

    productid = req.body.productId;
    console.log("Product id is : " + productid);

    let tempbuf = {}

    let cust = {
        // $id: req.body.id,
        $name: req.body.name,
        $address: req.body.address,
        $city: req.body.city,
        $phone: req.body.phone,
        $email: req.body.email
    };


    db.serialize(() => {

        db.run(`insert into CUSTOMER (Cust_name ,City ,Address ,Phone , Email) values
        ($name ,$city ,$address ,$phone ,$email )`, cust, (err) => {
            if (err) {
                res.render('error', { Error: err });

            } else {
                res.send("Thank you for ordering , Dear " + cust.$name + ". Your Product will be recied within 5 days." + `<a href="/">Click here to go to Home page</a> `);
            }
        });

        db.all(`select Cust_id from CUSTOMER where Cust_name = ?`, [cust.$name], (err, result) => {
            if (err) res.render('error', { Error: err });
            else {
                Cust_id = result[0].Cust_id;

                tempbuf = {
                    $cust: Cust_id,
                    $sid: req.body.shopId,
                    $pid: productid,
                    $date: date
                }
                console.log("Temp buf : ", tempbuf);

                db.run(`insert into ORDERS (Cust_id , Shop_id , Product_id , Order_date ) values 
                ($cust , $sid , $pid ,$date)`, tempbuf, (err) => {
                    err ? console.log(err) : console.log("Orders added with date : " + tempbuf.$date);
                })
            }
        })

        console.log("==> Customer Added :\n", cust);

    });



});

module.exports = router;