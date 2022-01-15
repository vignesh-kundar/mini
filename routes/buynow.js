const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB', (err) => {
    if (!err) {
        console.log("== connected to DB ==");
    }
});

const router = express.Router()

router.get("/", (req, res) => {
    res.render('buynow');
})

router.post("/", (req, res) => {

    var cust = {
        $id: req.body.id,
        $name: req.body.name,
        $address: req.body.address,
        $city: req.body.city,
        $phone: req.body.phone,
        $email: req.body.email
    };

    console.log(cust);
    //res.send(JSON.stringify(cust));

    db.run(`insert into CUSTOMER values
    ($id ,$name ,$city ,$address ,$phone ,$email )`, cust, (err) => {
        if (err) res.send(err)
        else res.send("Customer added!!\nWith id : " + cust.$id);
    })


});

module.exports = router;