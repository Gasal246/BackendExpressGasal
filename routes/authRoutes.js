const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//
require('dotenv').config();
//

router.post('/signup', (req, res) => {
    // res.send("This is signup page");
    console.log('sent by client - ', req.body);
    const { name, email, password, dob } = req.body;

    if (!name || !email || !password || !dob) {
        return res.status(422).send({ error: "pls fill the fields"})
    }

    User.findOne({ email: email}).then(async (savedUser) => {
        if(savedUser){
            return res.status(422).send({ error: "Invalid Creadentials" });
        }
        const user = new User({
            name,
            email,
            password,
            dob
        })

        try{
            await user.save();
            const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);
            res.send({token});
        }
        catch (err) {
            console.log('db err ', err);
            return res.status(422).send({ error: err.message })
        }
    })
})

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(422).json({error: "pls add email or password"});
    }

    const savedUser = await User.findOne({email: email});
    if (!savedUser) {
        return res.status(422).json({error: "NotExisting Credentials"});
    }

    try{
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result){
                console.log("Password matched");
                const token = jwt.sign({_id : savedUser._id}, process.env.JWT_SECRET);
                res.send({token});
            }else{
                console.log("Password mismatch");
                return res.status(422).json({error: "Invalidpswd Credentials"});
            }
        })
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;



