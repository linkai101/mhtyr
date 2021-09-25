require('dotenv').config();

//https://github.com/DevSnowflake/discord-player-extractors

const config = require("../config.json");
const presence = require('./lib/presence');
const slashcommands = require('./lib/slashcommands');
const musicplayer = require('./lib/player');

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES
  ],
  allowedMentions: {
    parse: ['users', 'roles'],
    repliedUser: false,
  }
});

// Initialize music player
const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;

client.on("ready", async () => {
  //await slashcommand.clear(client);
  //await slashcommands.post(client);
  //await slashcommands.clearDev(client);
  await slashcommands.postDev(client);
  await slashcommands.watch(client);

  await presence.set(client);

  await musicplayer.watch(client);
  
  console.log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);
});

client.login(process.env.TOKEN);