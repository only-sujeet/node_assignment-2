const express = require("express")
const multer = require('multer');
const User = require("../Model/userModel");
const path = require('path');
const router = express.Router()
const { jwtGenerate } = require("../middleWare/jwtMiddle");
const axios = require('axios');
// File upload setup using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get('/', async (req, res) => {
    res.render('upload')
})

router.post('/register', upload.fields([{ name: 'photo', maxCount: 1 }, { name: "document", maxCount: 10 }]), async (req, res) => {
    try {
        const { uname, age, email, password } = req.body;
        const photo = req.files['photo'] ? req.files['photo'][0].path : '';
        const document = req.files['document'] ? req.files['document'].map(file => file.path) : [];

        const user = new User({
            uname, age, email, password, photo, document
        })

        await user.save()
        res.redirect('/api/users/files')
    } catch (err) {
        res.status(400).json({ msg: "Registration Failed", err })
    }
})


router.get('/files', async (req, res) => {
    try {
        const users = await User.find().select('document uname');
        res.render('index', { users });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving files', error });
    }
});

router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Ensure the file exists before attempting to send it
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(404).send('File not found');
        }
    });
});

router.get('/loginfile', (req, res) => {
    res.render('loginfile')
})

router.get('/loginJwt', (req, res) => {
    res.render('loginJwt')
})

router.post('/loginJwt', jwtGenerate, async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(email)
        let checkUser = await User.findOne({ email });
        console.log(checkUser);
        if (!checkUser) {
            return res.render('notFound');
        }

        const checkPassword = await checkUser.matchPassword(password);
        if (checkPassword) {
            try {
                req.session.jwtToken =  req.token
                // Fetch data from the API
               
                // Send the API data as JSON response
                return res.redirect("/api/student/");
            } catch (apiError) {
                console.error('Error fetching student data:', apiError);
                return res.status(500).send('Error fetching student data');
            }
        } else {
            return res.render('notFound');
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/logout', (req, res) => {
    req.session.jwtToken = null;

    req.session = null;

    res.redirect('/login');
});



module.exports = router