const express = require('express')
const sqlite = require('sqlite3').verbose();



const router = express.Router()


router.get('/', (req, res) => {
    res.render("admin");

})

router.post("/", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')

    shops = []
    products = []
    orders = []

    if (req.body.usrname != "admin")
        res.send('<script> alert("Invalid Username !!!") </script>');
    else if (req.body.password != "123")
        res.send('<script> alert("Invalid Password !!!") </script>');
    else {

        db.serialize(() => {

            db.all(`SELECT * FROM SHOP`, (err, row) => {

                if (err)
                    console.log(err)
                else {
                    let i = 0;

                    row.forEach((shop) => {
                        shops[i++] = shop;
                    })
                }
            })


            db.all(`SELECT * FROM PRODUCTS`, (err, row) => {

                if (err)
                    console.log(err)
                else {
                    let j = 0;

                    row.forEach((rev) => {
                        products[j++] = rev;
                    })
                }
                console.log(products);
            })

            db.all(`SELECT * FROM ORDERS`, (err, row) => {

                if (err)
                    console.log(err)
                else {
                    let j = 0;

                    row.forEach((rev) => {
                        orders[j++] = rev;
                    })
                }
                console.log(products);
            })

        }); //end of serialize :)

        db.close((err) => {
            err ? console.log(err) : res.render("dashboard", { Angadi: shops, Saman: products, Orders: orders });
        });







    }
})



module.exports = router;