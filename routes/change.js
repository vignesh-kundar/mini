const express = require('express')
const sqlite = require('sqlite3').verbose();
const sessions = require('express-session');

const router = express.Router();

router.get("/modify/:table/:id", (req, res) => {
    let list = []
    const db = new sqlite.Database('./SHOP-DB');
    sql = `select * from ${req.params.table} where Shop_id = ${req.params.id}`
    db.all(sql, [], (err, row) => {
        err ? console.log(err) : list[0] = row[0];
        console.log(list.Shop_id);
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

    sql = `UPDATE SHOP
            SET Shop_name = "${req.body.Shop_name}",
            Shop_loc = "${req.body.Shop_loc}",
            Phone = ${req.body.Shop_phone},
            Email = "${req.body.Shop_email}"
            WHERE Shop_id = ${req.params.id} ;`

    console.log("SQL statement :" + sql)

    db.run(sql, [], (err) => {
        err ? console.error(err) : console.log("<=Updated SHOP table , with id " + req.params.id + "=>")
    })

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