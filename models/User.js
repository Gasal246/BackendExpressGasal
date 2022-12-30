const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
});

userSchema.pre('save', async function (next){
    const user = this;
    console.log("Just before saving & Before Hashing ", user.password);
    if(!user.isModified('password')){
        return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    console.log("Just after saving & after Hashing ", user.password)
    next();
})

mongoose.model("users", userSchema);
