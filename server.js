const pg = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

const port = process.env.port || 3000;
const hostname = "localhost";

<<<<<<< HEAD
const env = require("../env.json");
=======
// number of rounds the bcrypt algorithm will use to generate the salt
// the more rounds, the longer it takes
// so the salt will be more secure
// https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds
const saltRounds = 10;

>>>>>>> main
const Pool = pg.Pool;
const pool = new Pool({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT, 
    database : process.env.RDS_DB_NAME
});

pool.connect().then(function () {
    console.log(`Connected to database`);
});

app.use(express.static("public_html"));
app.use(express.json());

// Adding new listing to market
app.post("/newListing", function(req, res){
    let body = req.body;
    if(
        !body.hasOwnProperty("item") ||
        !body.hasOwnProperty("quantity") ||
        !body.hasOwnProperty("price") ||
        !body.hasOwnProperty("name") ||
        !(body.item.length >= 1) ||
        !(body.quantity > 0) ||
        !(body.name.length >= 1) ||
        !(body.price.length >= 1))
        {
            return res.sendStatus(400);
        }
    
    pool.query("INSERT INTO market(item, quantity, price, name) VALUES($1, $2, $3, $4) RETURNING *",
    [body.item, body.quantity, body.price, body.name])
    .then(function(response){
        console.log("Added New Listing");
        return res.sendStatus(200);
    })
    .catch(function(error){
        console.log(error.message);
        return res.sendStatus(500);
    })
});

app.get("/getListings", function(req, res){
    pool.query("SELECT * FROM market")
    // pool.query("CREATE TABLE market(item VARCHAR(50),quantity INT,price VARCHAR(50),name VARCHAR(50))")
    .then(function(response){
        return res.status(200).json({rows: response.rows});
    })
    .catch(function(error){
        console.log(error.message);
        return res.sendStatus(500);
    })
});

app.listen(port, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
