const jwt = require('jsonwebtoken')
const secret = "aclutnemdlofdfd"
const jwtGenerate = (req, res, next) => {
    const { email } = req.body
    const genToken = jwt.sign({email} , secret, { algorithm: "HS512", expiresIn: 360000 })

    if (!genToken) {
        res.status(401).send({ msg: "Email Not Found middle" })
    }

    // res.status(200).send(genToken)
    req.token = genToken
    next();
}


module.exports = { jwtGenerate }


