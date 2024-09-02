const student = require('../Model/studentModel')

const router = require('express').Router()

router.get('/', async (req, res) => {
    try {
        const token = req.session.jwtToken;

        if (!token) {
            res.render("loginJwt")
        }

        const getStudent = await student.find({})
        if (getStudent) {
            res.render('student', { getStudent })
        } else {
            res.status(401).json({ msg: "Not Found Student" })
        }
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router