# Securenv

This is a CLI for securenv API where you can upload your env files to a vault and share you your team from a secure way.


# Get started


## Login

You must be authenticated to get or set any data to secure vault.

```shell
$ npx securenv login [username] [password] [api-host]
```

The session will be available for 1h and after the first login you can use an shortcut to login withou pass the api-host.

```shell
$ npx securenv login [username] [password]
```

## Security alert

To GET, SET or LIST any information from the vault you have to be logged in and must have all the grants to to the job.

## Upload an ENV file

```shell
$ npx securenv set [project-name] [environment]
```

So if you want to upload your env.production file to the vault, you have to do:

```shell
$ npx securenv set my-project production

# this will upload .env.production to my-project production vault
```

By the way, if you dont say the environment, securenv will use .env file in production env.

```shell
$ npx securenv set my-project

# this will upload .env to my-project production vault
```

## Download an ENV file

```shell
$ npx securenv get [project-name] [environment]
```

So if you want to download your env.production file from the vault, you have to do:

```shell
$ npx securenv get my-project production

# this will replace .env.production file with the content of the vault
```

```shell
$ npx securenv get my-project staging

# this will replace .env.staging file with the content of the vault
```

## List environments

List all avaiable projects and environments that you have grants.

```shell
$ npx securenv list [project-name]

# this will list all available environments that you have grant
```

## Download an specific version

When you list list all avaiable projects and environments that you have grants, securenv will 
show to you up 10 old versions of some environment.

If you want to get an specific version you have to get the versionId you want and do:

```shell
$ npx securenv get [project-name] [environment] [version-id]

# this will list all available environments that you have grant
```