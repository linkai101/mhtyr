const Discord = require('discord.js');

/*
  ECHO SLASH COMMAND
  Demo command, disable in production
*/

module.exports = {
  info: {
    name: "echo",
    description: "[DEV] Makes Trill echo your message.",
    options: [
      {
        name: "content",
        description: "Content of the message.",
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        required: true
      }
    ]
  },
  run: async function(client, interaction) {
    const { options } = interaction;

    const embed = new Discord.MessageEmbed()
    .setDescription(options.getString("content"))
    .setAuthor(interaction.member.user.username);

    interaction.reply({
      embeds: [embed]
    });
  }
}
