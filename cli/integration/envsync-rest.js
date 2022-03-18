const fetch = require('node-fetch');

class EnvSyncRest {
    constructor() {
    }

    async login(login, password) {
        const result = await fetch(`${process.env.API_HOST}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login,
                password,
            })
        });

        if(result.status === 201) {
            const { jwt } = await result.json();
            return jwt;
        }

        throw 'Forbiden!';
    }

    async list(token, project) {
        const result = await fetch(`${process.env.API_HOST}/environments/${project}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(result.status === 403) {            
            throw new Error('Forbiden');
        }

        if(result.status === 404) {
            return undefined;
        }

        if(result.status === 200) {
            return result.json();
        }

        throw new Error('Ops! I cant list environments!');
    }

    async get(token, project, environment) {
        const result = await fetch(`${process.env.API_HOST}/environments/${project}/${environment}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(result.status === 403) {            
            throw new Error('Forbiden');
        }

        if(result.status === 404) {
            return undefined;
        }

        if(result.status === 200) {
            return result.json();
        }

        throw new Error('Ops! I cant get your env file...');
    }

    async set(token, project, environment, content) {
        const result = await fetch(`${process.env.API_HOST}/environments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                project,
                environment,
                content
            })
        });

        if(result.status === 403) {            
            throw new Error('Forbiden');
        }

        if(result.status === 200) {
            return undefined
        }

        throw new Error('Ops! I cant set your env file...');
    }
}

module.exports = new EnvSyncRest();