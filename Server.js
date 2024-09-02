const express = require('express')
const path = require('path')
const { DBconnection } = require('./Connection')
// const session = require("express-session")
const cookieSession = require("cookie-session")
const app = express()
const port = 3030

// app.use(session({
//     secret: "sujeet",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }
// }))


app.use(cookieSession({
    name: 'session',
    keys: ['yourSecretKey'],  
    maxAge: 24 * 60 * 60 * 1000  
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


DBconnection()

app.use('/api/users', require('./Routes/userRoute'))
app.use('/api/student', require('./Routes/studentRoute'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))

