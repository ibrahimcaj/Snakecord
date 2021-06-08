# Snakecord
A simple and fun way to play **Snake** inside of **Discord**! This **Discord** bot was made with Repl.it, using Discord's **new** message components!

Invite __Snakecord__ to your Discord server [here](https://discord.com/api/oauth2/authorize?client_id=847451240984215553&permissions=0&scope=bot%20applications.commands).

## Features
This bot has a lot of different features, including __automatic__ movement, points system and __backgrounds__!

![Screenshot](https://i.imgur.com/oshLfiW.png)
&nbsp;

## Run the code yourself
**Repl.it:**
- Fork the [GitHub Repository](https://github.com/vanishedvan/Snakecord) inside of Repl.it. ([Home](https://replit.com/~) -> Plus Button)
- Open the **Secrets** window on the left.
- Add the following secrets:
  - `production.stable` as the key, and your bot's token as the value.
  - `development.beta` as the key, and your bot's token as the value. (Only add this secret if you want a separate development bot.)
- Go to the **Shell**.
- Run `bash start.sh` to install __Node 15.3.0__ and to start the bot. (Run `bash beta.start.sh` if you want to start the beta bot.)

**Local:**
- Install [Node 15.3.0](https://nodejs.org/download/release/v15.3.0/).
- Fork the [GitHub Repository](https://github.com/vanishedvan/Snakecord) to your machine.
- Add the following environment variables:
  - `production.stable` as the key, and your bot's token as the value.
  - `development.beta` as the key, and your bot's token as the value. (Only add this secret if you want a separate development bot.)
- Run `bash start.sh` to install __Node 15.3.0__ and to start the bot. (Run `bash beta.start.sh` if you want to start the beta bot.)

*Note: Using the Repl.it shell and executing the bash scrips is **required** because Repl.it uses Node 12.16.1 instead of Node 15.3.0.*

## License
- This repository is licensed under the [MIT license](https://github.com/vanishedvan/Snakecord/blob/master/LICENSE).