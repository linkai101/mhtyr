const Discord = require('discord.js');

module.exports = {
  info: {
    name: "queue",
    description: "See the queue.",
  },
  run: async function(client, interaction) {
    await interaction.deferReply();
    
    // If user is not in vc
    if (!interaction.member.voice.channel) return interaction.editReply({
      content: `You must be in a voice channel to do this!`,
      ephemeral: true,
    });
    

    let guildQueue = client.player.getQueue(interaction.guildId);
    
    interaction.editReply({
      content: "Queue:\n"+guildQueue.songs.map(song => { return song.name }).join("\n"),
    });
  }
}
