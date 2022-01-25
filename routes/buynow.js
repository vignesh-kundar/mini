const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB')

const router = express.Router()

router.get("/:buynowId", (req, res) => {

    pdId = req.params.buynowId;
    console.log(pdId);

    var date = new Date().toISOString().split("T")[0];
    // var date = new Date().toLocaleDateString("hi-IN");

    res.render('buynow', { Date: date });
})

router.post("/", (req, res) => {

    var cust = {
        // $id: req.body.id,
        $name: req.body.name,
        $address: req.body.address,
        $city: req.body.city,
        $phone: req.body.phone,
        $email: req.body.email
    };

    console.log(cust);
    //res.send(JSON.stringify(cust));

    db.run(`insert into CUSTOMER (Cust_name , City , Address ,Phone ,Email ) values
    ($name ,$city ,$address ,$phone ,$email )`, cust, (err) => {
        if (err) res.send(err)
        else res.send("Thank you for ordering , Dear " + cust.$name + ". Your Product will be recied within 5 days." + `<a href="/">Click here to go to Home page</a> `);
    })


});

module.exports = router;