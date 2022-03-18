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

    async get(token, project, environment) {
        console.log('eee', environment)
        const result = await fetch(`${process.env.API_HOST}/sync/${project}/${environment}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(result.status === 403) {            
            return result.json();
        }

        if(result.status === 404) {
            return 'I could not find this environment'
        }

        if(result.status === 200) {
            return result.json();
        }

        return 'Ops! I cant sync your env file...';
    }

    async set(token, project, environment, content) {
        const result = await fetch(`${process.env.API_HOST}/sync`, {
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
            return result.json();
        }

        if(result.status === 200) {
            return `You env was synced ${project} - ${environment}`;
        }

        return 'Ops! I cant sync your env file...';
    }
}

module.exports = new EnvSyncRest();