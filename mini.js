const express = require('express');
const sqlite = require('sqlite3').verbose();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

console.clear();
console.log("\n==logs cleared==\n");

// CONNECT TO DB 
const db = new sqlite.Database('./SHOP-DB', (err) => {
    if (!err) {
        console.log("== connected to DB ==");
    }
});

// SERIAL EXECUTION => Table creation

db.serialize(() => {
    //setting foreign key 
    db.exec("PRAGMA foreign_keys = ON", (err) => {
            if (err) console.log(err);
            else console.log(" -- No error -- \n");
        }) //dosent work shit ;_;

    //CREATING TABLES ;) 

    db.run(`create table if not exists CUSTOMER (
        Cust_id integer primary key AUTOINCREMENT,
        Cust_name varchar(30),
        City varchar(30),
        Address Varchar(30),
        Phone numeric(10),
        Email varchar(30),
        UNIQUE (Phone),
        UNIQUE (Cust_name , City , Address , Phone , Email ) );`,

        (err) => {
            if (err) console.log(err);
            else
                console.log("\n---\n=> Customer created");
        })

    db.run(`create table if not exists SHOP (
        Shop_id integer primary key AUTOINCREMENT,
        Shop_name varchar(30),
        Shop_loc varchar(30),
        Phone numeric(10),
        Email varchar(30) )`,

        (err) => {
            if (err) console.log(err);
            else
                console.log("=> Shop created");
        })

    db.run(`create table if not EXISTS PRODUCTS (
        Product_id integer,
        Shop_id integer,
        Product_name varchar(30),
        Price smallmoney,
        Stocks integer,
        Type varchar(30),
        Brand varchar(30),
        Primary key (Product_id , Shop_id ),
        FOREIGN KEY (Shop_id) REFERENCES SHOP (Shop_id) ON DELETE CASCADE

    )`, (err) => {
        if (err) console.log(err);
        else
            console.log("=> Products created")
    })

    db.run(`create table if not EXISTS REVIEW (
        Review_id Integer Primary key AUTOINCREMENT,
        Cust_id Integer NOT NULL,
        Prdt_id Interger NOT NULL,
        Ratings Integer,
        Comments varchar(1000),
        FOREIGN KEY (Cust_id) REFERENCES CUSTOMER (Cust_id) ON DELETE CASCADE,
        FOREIGN KEY (Prdt_id) REFERENCES PRODUCTS (Product_id) ON DELETE CASCADE
      )`,
        (err) => {
            if (err) console.log(err);
            else
                console.log("=> review created");

        })

    db.run(`create table if not exists ORDERS (
        Order_id integer PRIMARY key AUTOINCREMENT,
        Cust_id integer,
        Shop_id integer,
        Product_id integer,
        Order_date date,
        FOREIGN KEY (Cust_id) REFERENCES CUSTOMER (Cust_id) ON DELETE CASCADE,
        FOREIGN KEY (Shop_id) REFERENCES SHOP (Shop_id) ON DELETE CASCADE,
        FOREIGN KEY (Product_id) REFERENCES PRODUCTS (Product_id) ON DELETE CASCADE
      )`, (err) => {
        if (err) console.log(err);
        else
            console.log("=> orders created")
    })

    db.run(`create table if not EXISTS VISITS (
        Cust_id integer,
        Shop_id integer,
        primary key (Cust_id , Shop_id),
        FOREIGN KEY (Cust_id) REFERENCES CUSTOMER (Cust_id) ON DELETE CASCADE,
        FOREIGN KEY (Shop_id) REFERENCES SHOP (Shop_id) ON DELETE CASCADE
      )`, (err) => {
        if (err) console.log(err);
        else console.log("=> visits created")
    })

    db.run(`create table if not EXISTS CONTAINS (
        Product_id integer,
        Order_id integer,
        primary key (Product_id , Order_id),
        FOREIGN KEY (Product_id) REFERENCES PRODUCTS (Product_id) ON DELETE CASCADE,
        FOREIGN KEY (Order_id) REFERENCES ORDERS (Order_id) ON DELETE CASCADE
      )`, (err) => {
        if (err) console.log(err);
        else console.log("=> contains created")
    })

    db.run(`create table if not EXISTS READ_REVIEW (
        Review_id integer,
        Order_id integer,
        primary key (Review_id , Order_id),
        FOREIGN KEY (Review_id) REFERENCES REVIEW (Review_id) ON DELETE CASCADE,
        FOREIGN KEY (Order_id) REFERENCES ORDERS (Order_id) ON DELETE CASCADE
      )
      `, (err) => {
        if (err) console.log(err);
        else console.log("=> read_review created\n---\n")
    })

}, (err) => {
    if (err) console.log(" ==> error :" + err);
    else console.log("==\nNO error in serial\n==\n")
})

const homeRoute = require("./routes/home")
const searchRoute = require("./routes/search")
const buynowRoute = require("./routes/buynow")
const productRoute = require("./routes/product")
const buyRoute = require("./routes/buy")
const reviewRoute = require("./routes/review")
const adminRoute = require("./routes/admin")
const shopRoute = require("./routes/Shop")

const queryRoute = require("./routes/query")
const changeRoute = require("./routes/change")


app.use("/", homeRoute);
app.use("/search", searchRoute);
app.use("/buynow", buynowRoute);
app.use("/product", productRoute);
app.use("/buy", buyRoute);
app.use("/review", reviewRoute);
app.use("/admin", adminRoute);
app.use("/shop", shopRoute);

app.use("/query/labrador", queryRoute);
app.use("/change", changeRoute);


////////////////////////////////




app.get('/about', (req, res) => {
    res.render('about')
});

app.get('/error', (req, res) => {
    res.render("error");
})


// SERVER CREATION
app.listen(3000, (req, res) => {
    console.log('== i love you 3000  ==\n-- Server Started --')
})