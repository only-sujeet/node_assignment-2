const express = require('express')
const path = require('path')
const { DBconnection } = require('./Connection')
const app = express()
const port = 3030

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


DBconnection()

app.use('/api/users', require('./Routes/userRoute'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))

