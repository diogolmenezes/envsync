require('dotenv').config()
const { program } = require('commander');
const rest = require('./integration/envsync-rest');
const fs = require('fs');

program
    .name('envsync')
    .description('CLI to sync env files')
    .version('0.0.1');

program
    .command('login')
    .description('Login')
    .argument('<login>', 'string to split')
    .argument('<password>', 'string to split')
    .action(async (login, password) => {
        try{
            const jwt = await rest.login(login, password)
            fs.writeFile('.envsync',jwt, () => console.log('You are in!'));
        }
        catch(error) {
            console.log('Forbiden!');
        }
    })


program
    .command('get')
    .description('Get env file')
    .argument('<project>', 'string to split')
    .argument('<environment>', 'string to split')
    .action(async (project, environment) => {
        console.log(project, environment);
        const result = await rest.get(project, environment)
        console.log(result)
    })

program
    .command('set')
    .description('Upload a new envFile')
    .argument('<project>', 'string to split')
    .argument('<environment>', 'string to split')
    .argument('<content>', 'string to split')
    .action(async (project, environment, content) => {
        console.log(project, environment, content);
        const result = await rest.set(project, environment, content)
        console.log(result)
    })

program.parse();