const envModel = require('../models/environment');
const { uuid } = require('uuidv4');
const SecurityService = require('../sevices/security-service');

class EnvironmentController {
    constructor() {
        this.security = new SecurityService();
    }

    async list(req, res, next) {
        try {
            const { project } = req.params;
            const envs = await envModel.find({ project })
            
            if(envs) {
                
                // remove the content of the env from the list
                delete env.content;
                env.versions.map(version => delete version.content)
                
                res.send(200, envs);
            }
            else 
                res.send(404);

            return next();
        }
        catch(error) {
            if(error.name === 'TokenExpiredError') {
                res.send(403, error);
            } else {
                res.send(500, error);
            }
            return next();
        }
    }

    async get(req, res, next) {
        try {
            const { project, environment } = req.params;
            const env = await envModel.findOne({ project, environment });
            
            if(env) {
                env.content = await this.security.decrypt(env.content);
                for(let i = 0; i < env.versions.length; i++) {
                    env.versions[i].content = await this.security.decrypt(env.versions[i].content);
                }
                res.send(200, env);
            }
            else 
                res.send(404);

            return next();
        }
        catch(error) {
            if(error.name === 'TokenExpiredError') {
                res.send(403, error);
            } else {
                res.send(500, error);
            }
            return next();
        }
    }

    async set(req, res, next) {
        const { project, environment } = req.params;
        const { content } = req.body;
        const secureContent = await this.security.encrypt(content);
        const env = await envModel.findOne({ project, environment });

        if(env) {
            // store only 10 versions
            if(env.versions.length >= 10) env.versions = [];

            env.versions.push({
                id: uuid(),
                login: env.login,
                project: env.project,
                environment: env.environment,
                content: env.content,
                createdAt: env.createdAt,
                updatedAt: env.updatedAt,
            })
            env.login = login;
            env.content = secureContent;
            env.updatedAt = new Date(),
            env.save();
        } else {
            envModel.create({
                login,
                project,
                environment, 
                content: secureContent,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }
        res.send(200, 'set');
        return next();
    }


}

module.exports = EnvironmentController;