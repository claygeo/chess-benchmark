# Description
This is a monorepo for Chessbenchmark.com, a platform for training various chess skills.

# Dev notes
There was some shuffling involved in quickly putting together this monorepo, so it's probably not your fault if the environment setup runs into issues. All of it worked for me locally though I had to go through additional setup for firebase that I don't remember at the moment. I'm not 100% sold on even using firebase here, I only included it for the signin with Google feature. If there's an easier way to just get that functionality we can do that instead. In general I am open to changes/suggestions so feel free to modify anything if it gets in the way. The main details I care about are listed below.


# Folder structure

## Backend
* Sets up a Docker container with services for Postgres and the Node GraphQL server. 
* Each src/modules/<module> represents a resource and encapsulates its relevant code. 
* src/generated directory for files generated with `bun codegen` 
* src/migrations directory for TypeORM migrations that run on server startup if not ran before. Stored in a migrations table in the DB for idempotency. 

## Frontend_concept
* NextJs boilerplate with some basic components outlining what I think the site experience would roughly be like. The main idea here is that we have humanbenchmark-type games such as:
    1. Memorizing increasingly long sequences of chess notation for famous openers.
    2. Visual memory - the user is shown increasingly sequences of moves on the board and asked to repeat them. Also based on real openers.
    3. Identifying squares - the user is shown a square on the board that gets highlighted and they are timed to see how fast they can name it eg. E4 square.
    This should be implemented in a modular way so that we can easily extend with more games.

## Frontend_template
* I copied this over from another nextjs frontend boilerplate repo that I briefly started working on. The main thing that I like here is the left side ShadCDN drawer, but it's also more developed in general.

## Native
* Outdated Expo boilerplate, just there to get a feel for how it fits into the monorepo. If this app ends up being genuinely useful I would like to build out the react native version, but for now it's not necessary.



