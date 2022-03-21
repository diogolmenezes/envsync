const model = require('../models/auth');
const jwt = require('jsonwebtoken');
const SecurityService = require('../sevices/security-service');


class AuthController {
    constructor() {
        this.security = new SecurityService();
    }

    async authMiddleware(req, res, next) {
        try{
            const auth = req.headers.authorization;
            const { id, login } = jwt.verify(auth.split(' ').pop(), process.env.JWT_SECRET);
            const user = await model.findById(id).lean();
            const { project, environment } = req.params;
            req.user = user;
            if(user.projects.find(p=> p.project === project && p.environment === environment)) {
                return next();
            } else {
                res.status(403).send('Forbiden! This user cant view this project/environment!');
            }
        }
        catch(error){
            res.status(403).send('Forbiden! You cant access this!');
        }
    }

    async login(req, res, next) {
        const { login, password } = req.body;
        const user = await model.findOne({ login });
        const unsecurePass = await this.security.decrypt(user.password);
        if(user && unsecurePass === password) {
            const token = jwt.sign({ id: user.id, login}, process.env.JWT_SECRET, {
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