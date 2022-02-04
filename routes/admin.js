const express = require('express')
const sqlite = require('sqlite3').verbose();
const sessions = require('express-session');

const db = new sqlite.Database('./SHOP-DB')

const router = express.Router();
const oneDay = 1000 * 60 * 60 * 24; //cookie for one day session
var session

router.use(sessions({
    secret: "MulleMadarChodBc",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

const foods = ["food-ramen", "food-sopes", "dogfood-1", "dogfood-2"];
const electronics = ["lgtv-1", "headphones-1", "graphicscard-950", "graphicscard-2080"];
const watches = ["watch-analog1", "watch-analog2", "watch-analog3", "watch-smart"];
const chapri = ["skincare-1", "skincare-2", "shoe-1", "glases-sun"];

const productType = [...foods, ...electronics, ...watches, ...chapri];

console.log("Product Types are : " + productType);

router.get('/', (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')

    session = req.session;

    if (session.userid) {


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
                // console.log(products);
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
                // console.log(products);
            })

        }); //end of serialize :)




        db.close((err) => {
            err ? console.log(err) : res.render("dashboard", { Angadi: shops, Saman: products, Orders: orders, pType: productType });
        });

    } else {
        res.render("admin");
    }

})

router.post("/", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB')

    shops = []
    products = []
    orders = []

    if (req.body.usrname == "admin" && req.body.password == "123") {
        session = req.session;
        session.userid = req.body.usrname;
        console.log("==Session==" + req.sesssion);

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
                //  console.log(products);
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
                //  console.log(products);
            })

        }); //end of serialize :)




        db.close((err) => {
            err ? console.log(err) : res.render("dashboard", { Angadi: shops, Saman: products, Orders: orders, pType: productType });
        });

    }

    // if (req.body.usrname != "admin")
    //     res.send('<script> alert("Invalid Username !!!") </script>');
    // else if (req.body.password != "123")
    //     res.send('<script> alert("Invalid Password !!!") </script>');
    // else {

    // }

})

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin")
})



module.exports = router;