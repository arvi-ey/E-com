const express = require('express')
const server = express()
const cookie_parser = require("cookie-parser")
const userModel = require("./user")
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser')

server.use(cors());
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookie_parser())

server.get("/", (req, res) => {
    res.send("HELLO SERVER")
})

server.post("/createuser", async (req, res) => {
    let { name, email, number, password, profile_image } = req.body;
    try {

        const emailResult = await userModel.findOne({ email: email })
        if (emailResult) {
            res.send("Email already exists")
            return
        }
        const mobileResult = await userModel.findOne({ number: number })
        if (mobileResult) {
            res.send("Mobile number already exists")
            return
        }
        if (!emailResult && !mobileResult) {
            bcrypt.genSalt(10, async function (err, salt) {
                bcrypt.hash(password, salt, async (err, hash) => {
                    const userresult = await userModel.create({
                        name, email, number, profile_image, password: hash
                    })
                    res.send(userresult)
                });
                // const token = jwt.sign({ email }, "sssshhhhh")
            });
        }
    }
    catch (er) {
        res.send(er)
    }
})


server.post("/signin", async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) return res.send("Email dosen't exist")
    else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email: req.body.email }, "sssssshh")
                res.send({ token, user })
            }
            else res.send("Password is incorrect")
        })
    }
})

server.listen(5000, () => {
    console.log(`server is listening on PORT:5000`)
})