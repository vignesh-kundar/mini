const express = require('express')
const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./SHOP-DB', (err) => {
    if (!err) {
        console.log("== connected to DB ==");
    }
});

const router = express.Router()


router.get('/', (req, res) => {
    res.render("admin");

})

router.post("/", (req, res) => {

    if (req.body.usrname != "admin")
        res.send('<script> alert("Invalid Username !!!") </script>');
    else if (req.body.password != "123")
        res.send('<script> alert("Invalid Password !!!") </script>');
    else res.render("dashboard")
})


module.exports = router;