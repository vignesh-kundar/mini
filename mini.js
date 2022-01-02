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
                console.log("\n---\n=> Customer created\n");
        })

    db.run(`create table if not exists SHOP (
        Shop_id integer primary key,
        Shop_name varchar(30),
        Shop_loc varchar(30),
        Phone numeric(10),
        Email varchar(30) )`,

        (err) => {
            if (!err)
                console.log("=> Shop created\n");
        })

    db.run(`create table if not EXISTS REVIEW (
        Review_id INteger Primary key,
        Cust_id Integer,
        Ratings Integer,
        Comments varchar(100),
        FOREIGN KEY (Cust_id) REFERENCES CUSTOMER (Cust_id) ON DELETE CASCADE
      )`,
        (err) => {
            if (err) {
                console.log("=> review created\n");
            }
        })

    db.run(`create table if not EXISTS PRODUCTS (
        Product_id integer Primary key,
        Product_name varchar(30),
        Price smallmoney,
        Stocks integer,
        Review_id integer,
        Brand varchar(30),
        FOREIGN KEY (Review_id) REFERENCES REVIEW (Review_id) ON DELETE CASCADE
    )`, (err) => {
        if (!err)
            console.error("=> Products created\n")
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
      )`, (err) => { if (!err) console.log("=> orders created\n") })

    db.run(`create table if not EXISTS VISITS (
        Cust_id integer,
        Shop_id integer,
        primary key (Cust_id , Shop_id),
        FOREIGN KEY (Cust_id) REFERENCES CUSTOMER (Cust_id) ON DELETE CASCADE,
        FOREIGN KEY (Shop_id) REFERENCES SHOP (Shop_id) ON DELETE CASCADE
      )`, (err) => { if (!err) console.log("=> visits created\n") })

    db.run(`create table if not EXISTS CONTAINS (
        Product_id integer,
        Order_id integer,
        primary key (Product_id , Order_id),
        FOREIGN KEY (Product_id) REFERENCES PRODUCTS (Product_id) ON DELETE CASCADE,
        FOREIGN KEY (Order_id) REFERENCES ORDERS (Order_id) ON DELETE CASCADE
      )`, (err) => { if (!err) console.log("=> contains created\n") })

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

// HOME ROUTE 
app.get("/", (req, res) => {
    //res.send('Kya Be Mulle!!');

})

app.post("/", (req, res) => {

    res.send("parsed data : " + req.body.data)

})

//BUY Page Load

app.post("/buy", (req, res) => {


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


})
const list = [];
app.get("/buy", (req, res) => {

    db.all(`select * from CUSTOMER`,
        (err, rows) => {
            if (err) res.send(err);
            else {
                let i = 0;
                rows.forEach((row) => {
                    //res.write("\ncontent:\n" + row + "\n----\n");
                    list[i++] = row;
                })
            }
        })

    db.close(err => {
        if (err) console.log(err)
        else {
            res.send(list);
        }
    })


});

//Review 

app.post("/review", (req, res) => {

    var rev = {
        $id: req.body.id,
        $cust_id: req.body.cust_id,
        $rating: req.body.rating,
        $comment: req.body.comment
    }

    //res.send(JSON.stringify(rev));

    db.run(`insert into REVIEW values
    ($id ,$cust_id ,$rating ,$comment)`, rev, (err) => {
        if (err) res.send(err);
        else res.send("Added Review\nWith review id " + rev.$id);
    })

})



app.post("/admin", (req, res) => {

    if (req.body.usrname != "admin")
        res.send("Invalid Username !!!");
    else if (req.body.password != "angadi")
        res.send("Invalid password!!!");
    else res.send("\n-:Welcome angadi owner:-\n");
})

// SERVER CREATION
app.listen(3000, (req, res) => {
    console.log('== i love you 3000  ==\n-- Server Started --')
})

app.post("/addProduct", (req, res) => {

    product = {
        $id: req.body.id,
        $name: req.body.name,
        $price: req.body.price,
        $stocks: req.body.stocks,
        $rev_id: req.body.rev_id,
        $brand: req.body.brand
    }

    res.send(JSON.stringify(product));

    db.run(`insert into PRODUCTS values
    ($id ,$name ,$price ,$stocks,$rev_id,$brand)`, product,
        (err) => {
            if (err) console.log(err)
            else console.log("added item to the products table !!")
        })
})