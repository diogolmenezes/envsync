const fetch = require('node-fetch');

class EnvSyncRest {
    constructor() {
    }

    login(user, password) {

    }

    async get(project, environment) {
        const result = await fetch(`${process.env.API_HOST}/sync/${project}/${environment}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImRpb2dvLm1lbmV6ZXMiLCJpYXQiOjE2NDc1NTg0NzEsImV4cCI6MTY0NzU2MjA3MX0.1bWU03Q85soC0CFj_kjLGhdwwm5gtsGXZ5G7kWRE6kY`
            }
        });

        if(result.status === 200) {
            return result.json();
        }

        return 'Ops i cant sync your env file...';
    }

    async set(project, environment, content) {
        const result = await fetch(`${process.env.API_HOST}/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImRpb2dvLm1lbmV6ZXMiLCJpYXQiOjE2NDc1NTg0NzEsImV4cCI6MTY0NzU2MjA3MX0.1bWU03Q85soC0CFj_kjLGhdwwm5gtsGXZ5G7kWRE6kY`
            },
            body: JSON.stringify({
                project,
                environment,
                content
            })
        });

        if(result.status === 200) {
            return `You env was synced ${project} - ${environment}`;
        }

        return 'Ops i cant sync your env file...';
    }
}

module.exports = new EnvSyncRest();