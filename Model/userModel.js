const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    uname: {
        type: String,
        required: [true, 'Enter Name']
    },
    age: {
        type: String,
        required: [true, 'Enter age']
    },
    email: {
        type: String,
        required: [true, 'Enter roll No.']
    },
    password: {
        type: String,
        required: [true, 'Enter YOur Password']
    },
    photo: {
        type: String,
        required: [true, 'Select Photo']
    },
    document: {
        type: [String],
        required: [true, 'Select document']
    },
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};



module.exports = mongoose.model('User', userSchema) 