const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

const config = require('../../config.json');

module.exports = {
  post: async function(client) {
    let commands = client.application?.commands;

    commands?.create(require('../slashcommands/play').info);
    commands?.create(require('../slashcommands/skip').info);
    commands?.create(require('../slashcommands/nowplaying').info);
    commands?.create(require('../slashcommands/queue').info);
    //commands?.create(require('../slashcommands/loop').info);
    //commands?.create(require('../slashcommands/loopqueue').info);
    //commands?.create(require('../slashcommands/autoplay').info);
    //commands?.create(require('../slashcommands/pause').info);
    //commands?.create(require('../slashcommands/resume').info);
    //commands?.create(require('../slashcommands/volume').info);
    //commands?.create(require('../slashcommands/lyrics').info);
    commands?.create(require('../slashcommands/disconnect').info);

    console.log("SLASHCOMMANDS> Global commands posted.");
  },
  postDev: async function(client) {
    const guild = client.guilds.cache.get(config.devGuild);
    let commands = guild.commands;

    commands?.create(require('../slashcommands/play').info);
    commands?.create(require('../slashcommands/skip').info);
    commands?.create(require('../slashcommands/nowplaying').info);
    commands?.create(require('../slashcommands/queue').info);
    //commands?.create(require('../slashcommands/loop').info);
    //commands?.create(require('../slashcommands/loopqueue').info);
    //commands?.create(require('../slashcommands/autoplay').info);
    //commands?.create(require('../slashcommands/pause').info);
    //commands?.create(require('../slashcommands/resume').info);
    //commands?.create(require('../slashcommands/volume').info);
    //commands?.create(require('../slashcommands/lyrics').info);
    commands?.create(require('../slashcommands/disconnect').info);

    console.log("SLASHCOMMANDS> Dev guild commands posted.");
  },
  clear: async function(client) { // TODO: Update with v13 methods
    let commands = await client.api.applications(client.user.id).commands.get();
    for (command of commands) {
      client.api.applications(client.user.id).guilds(config.devGuild).commands(command.id).delete();
    }
    console.log("SLASHCOMMANDS> Commands cleared.");
  },
  clearDev: async function(client) { // TODO: Update with v13 methods
    let commands = await client.api.applications(client.user.id).guilds(config.devGuild).commands.get();
    for (command of commands) {
      client.api.applications(client.user.id).guilds(config.devGuild).commands(command.id).delete();
    }
    console.log("SLASHCOMMANDS> Dev guild commands cleared.");
  },
  watch: async function(client) {
    const commands = [];
    await new Promise(function(resolve, reject) {
      // Load commands
      fs.readdir(path.join(__dirname, '../slashcommands'), function (err, files) {
        if (err) throw err;

        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if (jsfile.length <= 0) {
          console.log("SLASHCOMMANDS> Couldn't find commands.");
          return resolve();
        }

        jsfile.forEach(file => {
          if (path.extname(file).toLowerCase() === '.js') {
            let cmdName = require('../slashcommands/'+file).info.name;
            commands.push(cmdName);
            console.log(`SLASHCOMMANDS> ${cmdName} loaded`);
          }
        });
        resolve();
      });
    });

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName, options } = interaction;

      for (cmd of commands) {
        if (cmd === commandName) {
          let props = require('../slashcommands/'+cmd);

          if (typeof props.hasPerms === 'function' && props.hasPerms(client, interaction) === false) {
            return interaction.reply({
              content: "You're unable to run this command.",
              ephemeral: true,
            });
          }

          props.run(client, interaction, options);
        }
      }
    });
  }
}