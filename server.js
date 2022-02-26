const pg = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

const port = 3000;
const hostname = "localhost";

// number of rounds the bcrypt algorithm will use to generate the salt
// the more rounds, the longer it takes
// so the salt will be more secure
// https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds
const saltRounds = 10;

const env = require("../env.json");
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.use(express.static("public_html"));
app.use(express.json());

app.post("/user", function (req, res) {
    let username = req.body.username;
    let plaintextPassword = req.body.plaintextPassword;
    // TODO check body has username and plaintextPassword keys
    // TODO check password length >= 5 and <= 36
    // TODO check username length >= 1 and <= 20

    // TODO check if username already exists
    if (
        typeof username !== "string" ||
        typeof plaintextPassword !== "string" ||
        username.length < 1 ||
        username.length > 20 ||
        plaintextPassword.length < 5 ||
        plaintextPassword.length > 36
    ) {
        // username and/or password invalid
        return res.status(401).send();
    }

    pool.query("SELECT username FROM users WHERE username = $1", [username])
        .then(function (response) {
            if (response.rows.length !== 0) {
                // username already exists
                return res.status(401).send();
            }
            bcrypt
                .hash(plaintextPassword, saltRounds)
                .then(function (hashedPassword) {
                    pool.query(
                        "INSERT INTO users (username, hashed_password) VALUES ($1, $2)",
                        [username, hashedPassword]
                    )
                        .then(function (response) {
                            // account successfully created
                            res.status(200).send();
                        })
                        .catch(function (error) {
                            console.log(error);
                            res.status(500).send(); // server error
                        });
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(500).send(); // server error
                });
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).send(); // server error
        });
});

app.post("/auth", function (req, res) {
    let username = req.body.username;
    let plaintextPassword = req.body.plaintextPassword;
    pool.query("SELECT hashed_password FROM users WHERE username = $1", [
        username,
    ])
        .then(function (response) {
            if (response.rows.length === 0) {
                // username doesn't exist
                return res.status(401).send();
            }
            let hashedPassword = response.rows[0].hashed_password;
            bcrypt
                .compare(plaintextPassword, hashedPassword)
                .then(function (isSame) {
                    if (isSame) {
                        // password matched
                        res.status(200).send();
                    } else {
                        // password didn't match
                        res.status(401).send();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(500).send(); // server error
                });
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).send(); // server error
        });
});

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
    .then(function(response){
        return res.status(200).json({rows: response.rows});
    })
    .catch(function(error){
        console.log(error.message);
        return res.sendStatus(500);
    })
});
/*
app.post("/vulnerable", function (req, res) {
    let userValue = req.body.userValue;
    let myQuery = `SELECT * FROM users WHERE username = ${userValue}`;
    console.log(myQuery)
    pool.query(myQuery).then(
        function (response) {
            // do nothing
        }
    ).catch(function (error) {
        console.log(error);
    });
    res.send();
});
*/

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
