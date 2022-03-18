require('dotenv').config()
const { program } = require('commander');
const rest = require('./integration/envsync-rest');
const fs = require('fs');

getToken = () => {
    try {
        return fs.readFileSync('.envsync', 'utf8')
    } catch (error) {
        throw new Error(`You are not logged in`);
    }
}

getEnvPath = (environment) => {
    return !environment || environment === 'default' ? '.env' : `.env.${environment}`;
}

getEnvFile = (environment) => {
    try {
        return fs.readFileSync(getEnvPath(environment), 'utf8');
    } catch (error) {
        throw new Error(`This env file does not exists [${getEnvPath(environment)}]`);
    }
}

setEnvFile = (environment, content) => {
    try {
        return fs.writeFileSync(getEnvPath(environment), content);
    } catch (error) {
        throw new Error(`This env file does not exists [${getEnvPath(environment)}]`);
    }

}

program
    .name('envsync')
    .description('CLI to sync env files')
    .version('0.0.1');

program
    .command('login')
    .description('Login')
    .argument('<login>', 'your username')
    .argument('<password>', 'your password')
    .action(async (login, password) => {
        try {
            const jwt = await rest.login(login, password)
            fs.writeFileSync('.envsync', jwt);
            console.log('You are in!')
        }
        catch (error) {
            console.log('Forbiden!');
        }
    })

program
    .command('list')
    .description('List environments env file')
    .argument('<project>', 'Name of the project')
    .action(async (project, environment) => {
        try {
            const token = getToken();
            const environments = await rest.list(token, project)
            if(environments) {
                console.log(`Listing [${environments.length}] environments for [${project}]...`);
                environments.map(env => {
                    console.log(`=> PROJECT ${env.project} ENVIRONMENT ${env.environment} AUTHOR ${env.login} UPDATED AT ${env.updatedAt} VERSIONS ${env.versions.length+1}`);
                })
            } else {
                console.log(`This environment does not exists yet [${project}] [${environment || 'production'}]`);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    });

program
    .command('get')
    .description('Get environment file')
    .argument('<project>', 'Name of the project')
    .argument('[environment]', 'Environment of env file')
    .action(async (project, environment) => {
        try {
            const token = getToken();
            const result = await rest.get(token, project, environment || 'production')
            if(result) {
                console.log(`Loading [${result.project}] [${result.environment}] environment ...`);
                console.log(`Last Author [${result.login}] at [${result.updatedAt}]`);
                setEnvFile(environment, result.content);
                console.log('Done! You are up to date!');
            } else {
                console.log(`This environment does not exists yet [${project}] [${environment || 'production'}]`);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    });

program
    .command('set')
    .description('Upload a new environment')
    .argument('<project>', 'Name of the project')
    .argument('[environment]', 'Environment of env file')
    .action(async (project, environment) => {
        try {
            const token = getToken();
            const content = getEnvFile(environment)
            await rest.set(token, project, environment || 'production', content)
            console.log(`Uploading environment [${project}] [${environment || 'production'}]...`);
            console.log('Done! Your environment was uploaded!');
        }
        catch (error) {
            console.log(error.message);
        }
    })

program.parse();


