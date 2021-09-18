require('dotenv').config();

const config = require("../config.json");
const presence = require('./lib/presence');
const slashcommands = require('./lib/slashcommands');

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
const { Player } = require("discord-music-player");
const player = new Player(client, {
  deafenOnJoin: true,
  timeout: 180000, // 3min timeout
});
client.player = player;

client.on("ready", async () => {
  //await slashcommand.clear(client);
  //await slashcommands.clearDev(client);
  //await slashcommands.post(client);
  await slashcommands.postDev(client);
  await slashcommands.watch(client);

  await presence.set(client);

  console.log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);
});

client.login(process.env.TOKEN);