const jwt = require('jsonwebtoken')
const secret = "aclutnemdlofdfd"
const jwtGenerate = (req, res, next) => {
    const { email } = req.body
    const genToken = jwt.sign({ email }, secret, { algorithm: "ES512", expiresIn: 360000 })

    if (!genToken) {
        res.status(401).json({ msg: "Email Not Found middle" })
    }

    next();
}



