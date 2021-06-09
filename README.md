# Snakecord
A simple and fun way to play **Snake** inside of **Discord**! This **Discord** bot was made with Replit, using Discord's **new** message components!
This project was made for the **2021 Replit Discord Bot** task.

Invite __Snakecord__ to your Discord server [here](https://discord.com/api/oauth2/authorize?client_id=847451240984215553&permissions=0&scope=bot%20applications.commands).

## Features
This bot has a lot of different features, including __automatic__ movement, points system and __backgrounds__!

![Screenshot](https://i.imgur.com/oshLfiW.png)
&nbsp;

## Run the code yourself
### Repl.it:
- Fork the [GitHub Repository](https://github.com/vanishedvan/Snakecord) inside of Replit. ([Home](https://replit.com/~) -> Plus Button)
- Open the **Secrets** window on the left.
- Add the following secrets:
  - `PRODUCTION_STABLE` as the key, and your bot's token as the value.
  - `DEVELOPMENT_BETA` as the key, and your bot's token as the value. (Only add this secret if you want a separate development bot.)
- Go to the **Shell**.
- Run `bash start.sh` to install __Node 15.3.0__ and to start the bot. (Run `bash beta.start.sh` if you want to start the separate development bot.)

*Note: Using the Repl.it shell and executing the bash scripts is **required** because Replit uses Node 12.16.1 instead of Node 15.3.0.*

### Local:
- Install [Node 15.3.0](https://nodejs.org/download/release/v15.3.0/).
- Clone the [GitHub Repository](https://github.com/vanishedvan/Snakecord) to your machine.
- Add the following environment variables:
  - `PRODUCTION_STABLE` as the key, and your bot's token as the value.
  - `DEVELOPMENT_BETA` as the key, and your bot's token as the value. (Only add this variable if you want a separate development bot.)
- Run `node src/index.js production stable` to install __Node 15.3.0__ and to start the bot. (Run `node src/index.js development beta` if you want to start the development bot.)

## License
- This repository is licensed under the [MIT license](https://github.com/vanishedvan/Snakecord/blob/master/LICENSE).