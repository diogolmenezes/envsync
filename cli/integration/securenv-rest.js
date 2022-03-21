const fetch = require('node-fetch');
const fs = require('fs');

class SecurenvRest {
    constructor(apiHost) {
        this.apiHost = apiHost || process.env.API_HOST;
    }

    getConfiguration() {
        try {
            const content = fs.readFileSync(`${__dirname}/../.securenv`, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            throw new Error('We cant get the configuration file, you must log in!', error);
        }
    }

    async login(host, login, password) {
        const config  = host ? { host, jwt: '' } : this.getConfiguration();
        const apiHost = host || config.host;

        const result = await fetch(`${apiHost}/auth`, {
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
            return {
                host: apiHost,
                jwt
            };
        }

        throw 'Forbiden!';
    }

    async list(project) {
        const config = this.getConfiguration();
        const result = await fetch(`${config.host}/environments/${project}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.jwt}`
            }
        });

        if(result.status === 403) {  
            const body = await result.text();
            throw new Error(body || 'Forbiden! You cant access this!');
        }

        if(result.status === 404) {
            return undefined;
        }

        if(result.status === 200) {
            return result.json();
        }

        throw new Error('Ops! I cant list environments!');
    }

    async get(project, environment, versionId) {
        const config = this.getConfiguration();
        const result = await fetch(`${config.host}/environments/${project}/${environment}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.jwt}`
            }
        });

        if(result.status === 403) {  
            const body = await result.text();
            throw new Error(body || 'Forbiden! You cant access this!');
        }

        if(result.status === 404) {
            return undefined;
        }

        if(result.status === 200) {
            const json = await result.json();

            if(versionId) {
                console.log(`Retreiving an specific version [${project}] [${environment}] [${versionId}]`);
                const version = json.versions.find(version => version.id === versionId);
                return version;
            }

            return json;
        }

        throw new Error('Ops! I cant get your env file...');
    }

    async set(project, environment, content) {
        const config = this.getConfiguration();
        const result = await fetch(`${config.host}/environments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.jwt}`
            },
            body: JSON.stringify({
                project,
                environment,
                content
            })
        });

        if(result.status === 403) {  
            const body = await result.text();
            throw new Error(body || 'Forbiden! You cant access this!');
        }

        if(result.status === 200) {
            return undefined
        }

        throw new Error('Ops! I cant set your env file...');
    }
}

module.exports = new SecurenvRest();