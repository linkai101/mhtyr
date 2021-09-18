const config = require('../../config.json');

module.exports = {
  set: async function (client) {
    let presence = config.presence;
    client.user.setPresence({ 
      activities: presence.activities,
      status: presence.status,
      afk: presence.afk
    })

    //client.user.setActivity(null);
    console.log("PRESENCE> Bot presence set!");
  }
};