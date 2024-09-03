const tokenCheck = (req, res, next) => {
    try {
        const token = req.session.jwtToken;
        if (!token) {
            res.render("loginJwt")
        }

        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = { tokenCheck }
