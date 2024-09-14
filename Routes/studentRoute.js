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

router.get('/htmlget', tokenCheck, async (req, res) => {
    try {
        const getStudent = await student.find({});
        if (getStudent.length > 0) {
            // Send the student data as JSON response
            return res.status(200).json(getStudent);
        } else {
            // If no students are found
            return res.status(404).json({ msg: "No students found" });
        }
    } catch (error) {
        // Internal server error
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


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

router.post('/addStudentHtml', tokenCheck, async (req, res) => {
    try {
        const { sName, rollNo, age } = req.body;

        const newStudent = await student.create({ sName, rollNo, age });

        if (newStudent) {
            // Send success response as JSON
            res.status(200).json({ message: 'Student added successfully' });
        }
    } catch (error) {
        // Send error response as JSON
        res.status(500).json({ error: 'Error adding student' });
    }
});

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


// Route to get the student by ID for editing (responds with JSON data)
router.get('/editStudentHtml/:id',  async (req, res) => {
    try {
        const checkStudent = await student.findById(req.params.id);
        if (checkStudent) {
            return res.status(200).json(checkStudent); // Respond with student data as JSON
        } else {
            return res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Route to update student details
router.put('/editStudentHtml/:id',  async (req, res) => {
    try {
        const { sName, rollNo, age } = req.body;
        const editStudent = await student.findByIdAndUpdate(req.params.id, { sName, rollNo, age }, { new: true });

        if (editStudent) {
            return res.status(200).json({ message: 'Student updated successfully', student: editStudent });
        } else {
            return res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error updating student' });
    }
});


module.exports = router