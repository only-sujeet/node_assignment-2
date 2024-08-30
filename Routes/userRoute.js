const express = require("express")
const multer = require('multer');
const User = require("../Model/userModel");

const path = require('path');
const router = express.Router()

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
    // Accept only certain file types
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5  // 5MB max file size
    },
    fileFilter: fileFilter
});


router.get('/', async (req, res) => {
    res.render('upload')
})

router.post('/register', upload.fields([{ name: 'photo', maxCount: 1 }, { name: "document", maxCount: 10 }]), async (req, res) => {
    try {
        const { uname, age, rollNo } = req.body;
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

router.post('/loginJwt', async (req, res) => {
    const { email, password } = req.body

    const checkEmail = await User.findOne({ email: email })
    if (checkEmail) {
        res.render('dashboard', { title: "Welcome From JWT" })
    }
    else {
        res.render('notFound')
    }
})

module.exports = router