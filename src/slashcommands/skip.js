const Discord = require('discord.js');

// TODO: Check permissions

module.exports = {
  info: {
    name: "skip",
    description: "Skips the song that is currently playing.",
  },
  run: async function(client, interaction) {
    await interaction.deferReply();

    // If user is not in vc
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
    if (!queue) return await interaction.editReply({
      content: `❌ **There are no songs to skip**`
    })

    await queue.skip();
    
    return await interaction.editReply({ 
      content: '⏩ ***Skipped*** 👍'
    }); 
  }
}
