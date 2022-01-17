const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB')

const router = express.Router()

router.get("/", (req, res) => {
    res.send(`:) KYA BE MULLE\n,Wapas ja HOME page`);
})

router.post("/", (req, res) => {

    var rev = {
        $id: req.body.id,
        $cust_id: req.body.cust_id,
        $rating: req.body.rating,
        $prdt_id: req.body.prdt_id,
        $comment: req.body.comment
    }

    console.log(rev);

    //res.send(JSON.stringify(rev));

    db.run(`insert into REVIEW values
    ($id ,$cust_id ,$prdt_id,$rating ,$comment)`, rev, (err) => {
        if (err) res.send(err);
        else res.send("Added Review\nWith review id " + rev.$id);
    })

})

module.exports = router;