const Discord = require('discord.js');

// TODO: Check permissions

module.exports = {
  info: {
    name: "disconnect",
    description: "Disconnects the bot and clears queue.",
  },
  run: async function(client, interaction) {
    await interaction.deferReply();

    // If user/bot is not in vc
    if (!interaction.guild.me.voice.channelId)
    return interaction.editReply({
      content: `❌ **I am not connected to a voice channel**`,
      ephemeral: true,
    });
    if (!interaction.member.voice.channel)
      return interaction.editReply({
        content: `❌ **You are not connected to a voice channel**`,
        ephemeral: true,
      });
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId)
      return interaction.editReply({
        content: `❌ **You are not connected to my voice channel**`,
        ephemeral: true,
      });

    const queue = client.player.getQueue(interaction.guildId);

    await queue.stop();

    return await interaction.editReply({ 
      content: '📭 **Successfully disconnected**'
    }); 
  }
    
}
