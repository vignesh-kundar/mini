const express = require('express')
const sqlite = require('sqlite3').verbose();

const router = express.Router()

var date = new Date().toISOString().split("T")[0];


router.get("/:buynowId", (req, res) => {

    pdId = req.params.buynowId;
    console.log("Params is : " + pdId);

    res.render('buynow', { Date: date, Pid: pdId });
})




router.post("/", (req, res) => {

    const cid = [];
    const sid = [];

    const db = new sqlite.Database('./SHOP-DB')

    productid = req.body.productId;
    console.log("Product id is : " + productid);

    var cust = {
        // $id: req.body.id,
        $name: req.body.name,
        $address: req.body.address,
        $city: req.body.city,
        $phone: req.body.phone,
        $email: req.body.email
    };




    db.serialize(() => {
        //(Cust_name , City , Address ,Phone ,Email )

        db.run(`insert into CUSTOMER (Cust_name ,City ,Address ,Phone , Email) values
        ($name ,$city ,$address ,$phone ,$email )`, cust, (err) => {
            if (err) res.send(err + ` <a href="/">Home</a>`)
            else res.send("Thank you for ordering , Dear " + cust.$name + ". Your Product will be recied within 5 days." + `<a href="/">Click here to go to Home page</a> `);
        })
        console.log("==> Customer Added :\n", cust);


        db.all(`select Shop_id from PRODUCTS where Product_id = ?`, [productid], (err, srow) => {
            if (err) console.error(err);
            else {
                sid[0] = srow[0].Shop_id;
                console.log("==>\nValues from tables : \n", srow[0].Shop_id)
            }
        })

        db.all(`select Cust_id from CUSTOMER where Email = ?`, [cust.$email], (err, crow) => {
            if (err) console.error(err);
            else {
                cid[0] = crow[0].Cust_id;
                console.log(crow[0].Cust_id, "\n==>")
            }
        })


        tempbuf = {
            $cust: cid[0],
            $sid: sid[0],
            $pid: productid,
            $date: date
        }

        console.log("Temp buffer is : " + JSON.stringify(tempbuf));

        db.run(`insert into ORDERS (Cust_id ,Shop_id ,Product_id ,Order_date) 
        values ($cust ,$sid , $pid , $date) `, tempbuf, (err) => {
            if (err) console.log(err);
            else console.log("Orders iserted with order date : " + date);
        })

    })



});

module.exports = router;