const Discord = require('discord.js');

// TODO: Check if user is connected to channel
// TODO: Detect and play playlist

module.exports = {
  info: {
    name: "play",
    description: "Play music in your voice channel.",
    options: [
      {
        name: "query",
        description: "The name or url of the song. (YouTube, Spotify, etc.)",
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        required: true
      }
    ]
  },
  run: async function(client, interaction, options) {
    await interaction.deferReply();
    
    // If user is not in vc
    if (!interaction.member.voice.channel) return interaction.editReply({
      content: `You must be in a voice channel to do this!`,
      ephemeral: true,
    });

    let guildQueue = client.player.getQueue(interaction.guildId);

    let queue = client.player.createQueue(interaction.guildId);
    await queue.join(interaction.member.voice.channel);
    let song = await queue.play(options.getString("query")).catch(_ => {
      if (!guildQueue) queue.stop();
    });

    interaction.editReply({
      content: `Song added: **${song.name}**`,
    });
  }
}
