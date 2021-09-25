const Discord = require('discord.js');

module.exports = {
  info: {
    name: "nowplaying",
    description: "See the current song.",
  },
  run: async function(client, interaction) {
    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guildId);

    const nowPlaying = queue?.nowPlaying();
    
    if (!queue || !nowPlaying) return await interaction.editReply({
      content: `❌ **There are no songs playing right now**`
    });

    return await interaction.editReply({ 
      embeds: [
        new Discord.MessageEmbed()
        //.setColor('')
        .setAuthor('Now Playing ♪', client.user.avatarURL())
        .setThumbnail(nowPlaying.thumbnail)
        .setDescription(`
          [${nowPlaying.title}](${nowPlaying.url})
          \n\`${queue.createProgressBar({
            timecodes: true,
            queue: false,
            length: 30,
            line: '▬',
            indicator: '🔘',
          })}\`
          \n\`Requested by:\` ${nowPlaying.requestedBy.username} (${nowPlaying.requestedBy.tag})
        `)
      ]
    });
  }
}
