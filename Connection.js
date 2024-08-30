const mongoose = require('mongoose')

exports.DBconnection = () => {
  mongoose.connect('mongodb://localhost:27017/studentDetails').then(
    console.log("DataBase is Running ")
  ).catch((err) => {
    console.log(`Some connection error : ${err}`) 
  })
}
