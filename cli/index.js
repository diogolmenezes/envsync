require('dotenv').config()
const { program } = require('commander');
const rest = require('./integration/envsync-rest');
const fs = require('fs');

getToken = () => {
    return  fs.readFileSync('.envsync', 'utf8')
}

getEnvPath = (environment) => {
    return !environment || environment === 'default' ? '.env' : `.env.${environment}`;
}

getEnvFile = (environment) => {
    return fs.readFileSync(getEnvPath(environment), 'utf8');
}

setEnvFile = (environment, content) => {
    return fs.writeFileSync(getEnvPath(environment), content);
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
        try{
            const jwt = await rest.login(login, password)
            fs.writeFileSync('.envsync',jwt);
            console.log('You are in!')
        }
        catch(error) {
            console.log('Forbiden!');
        }
    })


program
    .command('get')
    .description('Get env file')
    .argument('<project>', 'Name of the project')
    .argument('[environment]', 'Environment of env file')
    .action(async (project, environment) => {
        const token = getToken();
        const result = await rest.get(token, project, environment || 'production')
        console.log(`Loading [${result.project}] [${result.environment}] environment`);
        console.log(`Last Author [${result.login}] at [${result.updatedAt}]`);
        setEnvFile(environment, result.content);
        console.log('Done! You are up to date!');
    })

program
    .command('set')
    .description('Upload a new envFile')
    .argument('<project>', 'Name of the project')
    .argument('[environment]', 'Environment of env file')
    .action(async (project, environment) => {
        const token   = getToken();
        const content = getEnvFile(environment)
        const result  = await rest.set(token, project, environment || 'production', content)
        console.log(result)
    })

program.parse();


