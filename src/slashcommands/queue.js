const Discord = require('discord.js');

module.exports = {
  info: {
    name: "queue",
    description: "See the queue.",
  },
  run: async function(client, interaction) {
    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guildId);
    
    const nowPlaying = queue?.nowPlaying();

    return await interaction.editReply({ 
      embeds: [
        new Discord.MessageEmbed()
        //.setColor('')
        .setTitle(`Queue for ${interaction.guild.name}`)
        .setDescription(`
          __Now Playing:__
          ${nowPlaying ? `[${nowPlaying.title}](${nowPlaying.url}) | \`${nowPlaying.duration} Requested by: ${nowPlaying.requestedBy.username} (${nowPlaying.requestedBy.tag})\``
            : "Nothing, let's get this party started! 🎉"}
          ${queue?.tracks.length > 0 ? `
            __Up Next:__${queue.tracks.map((t, i) => `
              \`${i+1}.\` [${t.title}](${t.url}) | \`${t.duration} Requested by: ${t.requestedBy.username} ${t.requestedBy.tag}\`
            `).join('')}
            **${queue.tracks.length} songs in queue | ${formatMs(queue.totalTime)} total length**
          ` : ''}
        `)
        .setFooter(
          `Page 1/1 | Loop: ${queue?.repeatMode === 1 ? '✔️' : '❌'} | Queue Loop: ${queue?.repeatMode === 2 ? '✔️' : '❌'} | Autoplay: ${queue?.repeatMode === 3 ? '✔️' : '❌'}`, 
          interaction.user.avatarURL()
        )
      ]
    });
  }
}

function formatMs(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}