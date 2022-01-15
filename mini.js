const express = require('express');
const sqlite = require('sqlite3').verbose();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



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
        Cust_id integer primary key,
        Cust_name varchar(30),
        City varchar(30),
        Address Varchar(30),
        Phone numeric(10),Email varchar(30) )`,

        (err) => {
            if (!err)
                console.log("\n---\n=> Customer created");
        })

    db.run(`create table if not exists SHOP (
        Shop_id integer primary key,
        Shop_name varchar(30),
        Shop_loc varchar(30),
        Phone numeric(10),
        Email varchar(30) )`,

        (err) => {
            if (!err)
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
        if (!err)
            console.log("=> Products created")
    })

    db.run(`create table if not EXISTS REVIEW (
        Review_id Integer Primary key,
        Cust_id Integer,
        Prdt_id Interger,
        Ratings Integer,
        Comments varchar(1000),
        FOREIGN KEY (Cust_id) REFERENCES CUSTOMER (Cust_id) ON DELETE CASCADE,
        FOREIGN KEY (Prdt_id) REFERENCES PRODUCTS (Product_id) ON DELETE CASCADE
      )`,
        (err) => {
            if (!err) {
                console.log("=> review created");
            }
        })

    db.run(`create table if not exists ORDERS (
        Order_id integer PRIMARY key,
        Cust_id integer,
        Shop_id integer,
        Product_id integer,
        Order_date date,
        FOREIGN KEY (Cust_id) REFERENCES CUSTOMER (Cust_id) ON DELETE CASCADE,
        FOREIGN KEY (Shop_id) REFERENCES SHOP (Shop_id) ON DELETE CASCADE,
        FOREIGN KEY (Product_id) REFERENCES PRODUCTS (Product_id) ON DELETE CASCADE
      )`, (err) => { if (!err) console.log("=> orders created") })

    db.run(`create table if not EXISTS VISITS (
        Cust_id integer,
        Shop_id integer,
        primary key (Cust_id , Shop_id),
        FOREIGN KEY (Cust_id) REFERENCES CUSTOMER (Cust_id) ON DELETE CASCADE,
        FOREIGN KEY (Shop_id) REFERENCES SHOP (Shop_id) ON DELETE CASCADE
      )`, (err) => { if (!err) console.log("=> visits created") })

    db.run(`create table if not EXISTS CONTAINS (
        Product_id integer,
        Order_id integer,
        primary key (Product_id , Order_id),
        FOREIGN KEY (Product_id) REFERENCES PRODUCTS (Product_id) ON DELETE CASCADE,
        FOREIGN KEY (Order_id) REFERENCES ORDERS (Order_id) ON DELETE CASCADE
      )`, (err) => { if (!err) console.log("=> contains created") })

    db.run(`create table if not EXISTS READ_REVIEW (
        Review_id integer,
        Order_id integer,
        primary key (Review_id , Order_id),
        FOREIGN KEY (Review_id) REFERENCES REVIEW (Review_id) ON DELETE CASCADE,
        FOREIGN KEY (Order_id) REFERENCES ORDERS (Order_id) ON DELETE CASCADE
      )
      `, (err) => { if (!err) console.log("=> read_review created\n---\n") })

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
const addshopRoute = require("./routes/addshop")

//Home page
app.use("/", homeRoute);
//Search Page
app.use("/search", searchRoute);
//Buynow
app.use("/buynow", buynowRoute);
//Product Page
app.use("/product", productRoute);
//buy
app.use("/buy", buyRoute);
//revoew
app.use("/review", reviewRoute);
//admin
app.use("/admin", adminRoute);
//add Product
app.use("/addshop", addshopRoute);

////////////////////////////////

app.get('/about', (req, res) => {
    res.render('error')
});

app.get('/error', (req, res) => {
    res.render("error");
})


// SERVER CREATION
app.listen(3000, (req, res) => {
    console.log('== i love you 3000  ==\n-- Server Started --')
})