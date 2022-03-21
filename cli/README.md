# Securenv

This is a CLI for securenv API where you can upload your env files to share you your team from a secure way.


# Get started


## Login

You must be authenticated to get or set any data to secure vault.

```shell
$ npx securenv login [username] [password] [api-host]
```

## Set an ENV file

```shell
$ npx securenv set [project-name] [environment]
```

So if you want to upload your env.production file to the vault, you have to do:

```shell
$ npx securenv set my-project production
```

By the way, if you dont say the environment, securenv will use .env file in production env.

```shell
$ npx securenv set my-project
#this will upload .env to my-project production vault
```