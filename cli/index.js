#!/usr/bin/env node
require('dotenv').config()
const { program } = require('commander');
const rest = require('./integration/securenv-rest');
const fs = require('fs');

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
    .name('securenv')
    .description('CLI to sync env files')
    .version('1.0.10');

program
    .command('login')
    .description('Login')
    .argument('<login>', 'your username')
    .argument('<password>', 'your password')
    .argument('[host]', 'securenv host')
    .action(async (login, password, host) => {
        try {
            const config = await rest.login(host, login, password)        
            fs.writeFileSync(`${__dirname}/.securenv`, JSON.stringify(config));
            console.log('You are in!')
        }
        catch (error) {
            console.log('Forbiden!', error);
        }
    })

program
    .command('list')
    .description('List environments env file')
    .argument('<project>', 'Name of the project')
    .action(async (project, environment) => {
        try {
            const environments = await rest.list(project)
            if(environments) {
                console.log(`Listing [${environments.length}] environments for [${project}]...`);
                environments.map(env => {
                    console.log(`=>  ${env.project.toUpperCase()} at ${env.environment} has ${env.versions.length+1} version(s):`);
                    console.log('');
                    console.log(`   - CURRENT by ${env.login} updated at ${env.updatedAt}`);
                    env.versions.map(version => {
                        console.log(`   - ${version.id} by ${env.login} updated at ${env.updatedAt}`);
                    });
                    console.log('');
                    console.log('');
                });
                console.log('If you need to get an specific vesion, just do: securenv get [project] [env] [version-id]')
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
    .argument('[versionId]', 'Id of an version')
    .action(async (project, environment, versionId) => {
        try {
            const result = await rest.get(project, environment || 'production', versionId)
            if(result) {
                console.log(`Loading [${result.project}] [${result.environment}] [${versionId || 'current'}] ...`);
                console.log(`Author [${result.login}] at [${result.updatedAt}]`);
                setEnvFile(environment, result.content);
                console.log('Done! You are up to date!');
            } else {
                console.log(`This environment/version does not exists yet [${project}] [${environment || 'production'}] [${versionId || 'current'}]`);
            }
        }
        catch (error) {
            console.log(error.message);
        }
    });

program
    .command('cat')
    .description('Cat environment file')
    .argument('<project>', 'Name of the project')
    .argument('[environment]', 'Environment of env file')
    .argument('[versionId]', 'Id of an version')
    .action(async (project, environment, versionId) => {
        try {
            const result = await rest.get(project, environment || 'production', versionId)
            if(result) {
                console.log(`Loading [${result.project}] [${result.environment}] [${versionId || 'current'}] ...`);
                console.log(`Author [${result.login}] at [${result.updatedAt}]`);
                console.log(result.content)
                console.log('Done! You are up to date!');
            } else {
                console.log(`This environment/version does not exists yet [${project}] [${environment || 'production'}] [${versionId || 'current'}]`);
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
            const content = getEnvFile(environment)
            await rest.set(project, environment || 'production', content)
            console.log(`Uploading environment [${project}] [${environment || 'production'}]...`);
            console.log('Done! Your environment was uploaded!');
        }
        catch (error) {
            console.log(error.message);
        }
    })

program.parse();


