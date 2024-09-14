const express = require('express')
const path = require('path')
const { DBconnection } = require('./Connection')
const session = require("express-session")
// const cookieSession = require("cookie-session")
// const RedisStore = require("connect-redis").default;
const app = express()
const port = 3030
const methodOverride = require('method-override');
// const { createClient } = require('redis');
const categoryRoutes = require('./Routes/categoryRoute');
const productRoutes = require('./Routes/productRoute');



// Set up Redis client
// const redisClient = createClient()
// redisClient.connect().catch(console.error);
DBconnection()

app.use(session({
    // store: new RedisStore({ client: redisClient }),
    secret: "sujeet",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
}))


// app.use(cookieSession({
//     name: 'session',
//     keys: ['yourSecretKey'],  
//     maxAge: 24 * 60 * 60 * 1000  
// }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))
app.use(methodOverride('_method')); // For handling PUT and DELETE requests

app.set('view engine', 'ejs')
app.use(express.static("Html"))
app.set('views', path.join(__dirname, 'views'))

app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/api/student', require('./Routes/studentRoute'))
app.use('/api/users', require('./Routes/userRoute'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))


