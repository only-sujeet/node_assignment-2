const { tokenCheck } = require('../middleWare/securitymiddle')
const student = require('../Model/studentModel')

const router = require('express').Router()

router.get('/', tokenCheck, async (req, res) => {
    try {
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

router.get('/addStudent', tokenCheck, async (req, res) => {
    res.render('addstudent')
})

router.post('/addStudent', tokenCheck, async (req, res) => {
    try {
        const { sName, rollNo, age } = req.body

        const newStudent = await student.create({ sName, rollNo, age })

        if (newStudent) {
            res.redirect('/api/student/')
        }
    } catch (error) {
        res.render('error', { error })
    }
})

router.delete('/deleteStudent/:id', tokenCheck, async (req, res) => {
    try {
        const { id } = req.params
        const delStudent = await student.deleteOne({ _id: id })

        if (delStudent) {
            res.redirect('/api/student/')
        }

    } catch (error) {
        res.render('error', { error })
    }
})

router.get('/editStudent/:id', tokenCheck, async (req, res) => {
    try {
        const checkStudent = await student.findById(req.params.id)
        res.render('edit', { checkStudent })
    } catch (error) {
        res.render('error', { error })
    }
})

router.put('/:id', tokenCheck, async (req, res) => {
    try {
        const { sName, rollNo, age } = req.body

        const editStudent = await student.findByIdAndUpdate(req.params.id, { sName, rollNo, age })

        if (editStudent) {
            res.redirect('/api/student/')
        }
    } catch (error) {
        res.render('error', { error })
    }
})


module.exports = router