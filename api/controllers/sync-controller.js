const jwt = require('jsonwebtoken');
const envModel = require('../models/env');

class SyncController {
    constructor() {
    }

    async get(req, res, next) {
         // TODO: jogar auth pra fora
         const auth = req.headers.authorization;
         const { login } = jwt.verify(auth.split(' ').pop(), process.env.JWT_SECRET)
         const { project, environment } = req.params;
 
         const env = await envModel.findOne({ project, environment })
 
         res.send(200, env);
         return next();
    }

    async set(req, res, next) {
        // TODO: jogar auth pra fora
        const auth = req.headers.authorization;
        const { login } = jwt.verify(auth.split(' ').pop(), process.env.JWT_SECRET)
        const { project, environment, content } = req.body;

        envModel.create({
            login,
            project,
            environment, 
            content: JSON.stringify(content),
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        res.send(200, 'set');
        return next();
    }

}

module.exports = SyncController;