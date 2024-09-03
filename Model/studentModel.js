const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    sName:{
        type:String,
        required:[true,"Enter Name "]
    },
    rollNo:{
        type:String,
        required:[true,"Enter Roll No. "]
    },
    age:{
        type:String,
        required:[true,"Enter Age "]
    },
})

const student = mongoose.model("student",studentSchema)

module.exports = student