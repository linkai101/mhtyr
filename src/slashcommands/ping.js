const Discord = require("discord.js");

/*
  PING SLASH COMMAND
  Demo command, disable in production
*/

module.exports = {
  info: {
    name: "ping",
    description: "[DEV] Pings Trill.",
  },
  run: function(client, interaction) {
    interaction.reply({
      content: "Pong!",
    });
  }
}