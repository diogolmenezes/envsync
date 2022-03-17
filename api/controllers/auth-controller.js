const model = require('../models/auth');
const jwt = require('jsonwebtoken');


class AuthController {
    constructor() {
    }

    async login(req, res, next) {
        const { login, password } = req.body;
        const user = await model.findOne({ login, password })

        if(user) {
            const token = jwt.sign({ login }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            res.status(201).send({ jwt: token });
            return next();
        } else {
            res.send(403, 'Forbidden')
        }
    }

    
}

module.exports = AuthController;