const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB')

const router = express.Router()

var pdId




var date = new Date().toISOString().split("T")[0];



router.get("/:buynowId", (req, res) => {

    pdId = req.params.buynowId;
    console.log(pdId);

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

    console.log("==> Customer Added :\n", cust);
    //res.send(JSON.stringify(cust));

    pid_val = pdId;

    db.serialize(() => {

        db.run(`insert into CUSTOMER (Cust_name , City , Address ,Phone ,Email ) values
    ($name ,$city ,$address ,$phone ,$email )`, cust, (err) => {
            if (err) res.send(err)
            else res.send("Thank you for ordering , Dear " + cust.$name + ". Your Product will be recied within 5 days." + `<a href="/">Click here to go to Home page</a> `);
        })

        db.parallelize(() => {

            db.all(`select Shop_id from PRODUCTS where Product_id = ?`, [pid_val], (err, srow) => {
                if (err) console.error(err);
                else {
                    console.log("==>\nValues from tables : \n", srow[0].Shop_id)
                        //cId = srow[0].Shop_id;


                }
            })

            db.all(`select Cust_id from CUSTOMER where Email = ?`, [cust.$email], (err, crow) => {
                if (err) console.error(err);
                else {
                    console.log(crow[0].Cust_id, "\n==>")
                        //cId = srow[0].Cust_id;
                }
            })

        })





        var tempbuf = {
            $cust: null,
            $sid: null,
            $pid: pid_val,
            $date: date
        }

        console.log("====> Temp Buffer is : \n", tempbuf)

        // db.run(`insert into ORDERS (Cust_id ,Shop_id ,Product_id ,Order_date) 
        // values ($cust ,$sid , $pid , $date) `, tempbuf, (err) => {
        //     if (err) console.log(err)
        // })




    })



});

module.exports = router;