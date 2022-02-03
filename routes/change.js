const express = require('express')
const sqlite = require('sqlite3').verbose();
const sessions = require('express-session');

const router = express.Router();

router.get("/modify/:table/:id", (req, res) => {
    let list = []
    const db = new sqlite.Database('./SHOP-DB');



    switch (req.params.table) {
        case "SHOP":
            sql = `select * from ${req.params.table} where Shop_id = ${req.params.id}`
            break;
        case "PRODUCTS":
            sql = `select * from ${req.params.table} where Product_id = ${req.params.id}`
            break;
        default:
            sql = undefined;
    }


    console.log(sql);
    db.all(sql, [], (err, row) => {
        err ? console.log(err) : list[0] = row[0];
        console.log(list);
    })

    db.close((err) => {
        if (!err) {
            res.render("modify", { Table: req.params.table, List: list });
        }
    })

});

router.post("/modify/:table/:id", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB');

    //UPDATE table_name
    // SET column1 = value1, column2 = value2, ...
    // WHERE condition;

    switch (req.params.table) {

        case "SHOP":
            sql = `UPDATE SHOP
SET Shop_name = "${req.body.Shop_name}",
Shop_loc = "${req.body.Shop_loc}",
Phone = ${req.body.Shop_phone},
Email = "${req.body.Shop_email}"
WHERE Shop_id = ${req.params.id} ;`
            break;
        case "PRODUCTS":
            sql = `UPDATE PRODUCTS
SET Product_name = "${req.body.prdt_name}",
Price = "${req.body.prdt_price}",
Stocks = ${req.body.prdt_stocks},
Type = "${req.body.prdt_type}",
Brand = "${req.body.prdt_brand}"
WHERE Product_id = ${req.params.id};`

    }



    console.log("SQL statement :" + sql)

    db.run(sql, [], (err) => {
        err ? console.error(err) : console.log(`<=Updated ${req.params.table} table , with id ${req.params.id} =>`);
    });

    console.log(req.params.table + " " + req.params.id);

    db.close((err) => {
        if (!err) {
            res.redirect("/admin")
        }
    })

})

router.get("/delete/:table/:id", (req, res) => {

    const db = new sqlite.Database('./SHOP-DB');

    let sql

    const table = req.params.table;
    const id = req.params.id;

    switch (table) {
        case 'ORDERS':
            sql = `delete from ${table} where Order_id = ${id};`
            db.run(sql, [], (err) => {
                err ? res.render("err", { Error: err }) : console.log("Order deleted with Order_id : " + id);
            });

            break;

        case 'PRODUCTS':
            sql = `delete from ${table} where Product_id = ${id};`
            db.run(sql, [], (err) => {
                err ? res.render("err", { Error: err }) : console.log("Product deleted with Product_id : " + id);
            });

            break;

        case 'SHOP':
            sql = `delete from ${table} where Shop_id = ${id};`
            db.run(sql, [], (err) => {
                err ? res.render("err", { Error: err }) : console.log("Product deleted with Product_id : " + id);
            });

            break;


        default:
            res.render("error", { Error: "Table illa anna" });
    }


    db.close((err) => {
        if (!err) {
            res.redirect('/admin/logout');
        }


    })

});


module.exports = router;