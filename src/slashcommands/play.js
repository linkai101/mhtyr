const Discord = require('discord.js');

// TODO: Check permissions

module.exports = {
  info: {
    name: "play",
    description: "Play music in your voice channel.",
    options: [
      {
        name: "query",
        description: "The name or url of the song. (YouTube, Spotify, Soundcloud)",
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        required: true
      }
    ]
  },
  run: async function(client, interaction, options) {
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
    
    const query = options.get("query").value;
    const queue = client.player.createQueue(interaction.guild, { // PlayerOptions
      leaveOnEmptyCooldown: 30000,
      bufferingTimeout: 0,
      metadata: {
        channel: interaction.channel
      }
    });
        
    // verify vc connection
    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.editReply({ content: "❌ **Failed to join VC** Check my permissions or the channel permissions." });
    }

    interaction.editReply({ content: `🎵 Searching 🔎\`${query}\`` });

    const results = await client.player.search(query, {
      requestedBy: interaction.user
    });

    // Note: results.tracks is the same results.playlist.tracks if it is a playlist

    if (results.tracks.length === 0) return await interaction.followUp({ content: `❌ **Could not find a song matching the query**` });

    if (results.playlist) { // PLAYLIST
      let playlist = results.playlist;
      queue.play(playlist.tracks[0]);
      queue.addTracks(playlist.tracks.slice(1));

      return await interaction.editReply({ 
        content: `${
          playlist.source === 'youtube' ? '▶️' 
          : playlist.source === 'spotify' ? '🟢' 
          : playlist.source === 'soundcloud' ? '🟧'
          : '🎵'} **Searching** 🔎\`${query}\``,
        embeds: [
          new Discord.MessageEmbed()
          .setTitle(playlist.title)
          .setURL(playlist.url)
          .setAuthor('Added to queue', interaction.user.avatarURL())
          .setThumbnail(playlist.thumbnail)
          .addFields(
            //{ name: 'Estimated time until playing', value: '---', inline: true },
            { name: 'Position in queue', value: (queue.tracks.length-playlist.tracks.length+1).toString() || 'Now', inline: true },
            { name: 'Enqueued', value: `\`${playlist.tracks.length}\` songs`, inline: true },
          )
        ]
      });
    } else { // SONG
      let track = results.tracks[0];
      queue.play(track);

      return await interaction.editReply({ 
        content: `${
          track.source === 'youtube' ? '▶️' 
          : track.source === 'spotify' ? '🟢' 
          : track.source === 'soundcloud' ? '🟧'
          : '🎵'} **Searching** 🔎\`${query}\``,
        embeds: [
          new Discord.MessageEmbed()
          .setTitle(track.title)
          .setURL(track.url)
          .setAuthor('Added to queue', interaction.user.avatarURL())
          .setThumbnail(track.thumbnail)
          .addFields(
            { name: 'Channel', value: track.author, inline: true },
            { name: 'Song Duration', value: track.duration, inline: true },
            //{ name: 'Estimated time until playing', value: '---', inline: true },
            { name: 'Position in queue', value: queue.tracks.length.toString() || 'Now', inline: true },
          )
        ]
      });
    }

  }
}
