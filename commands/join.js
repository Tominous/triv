exports.run = async (client, message) => {
  if (!message.guild.voice || !message.guild.voice.connection) {
    const vc = message.member.voice.channel;

    if (vc) {
      if (!vc.joinable) return message.channel.send('I cannot join the vc');
      const permissions = vc.permissionsFor(client.user);
      if (!permissions.has('CONNECT'))
        return message.reply('cannot connect to voice channel, missing the **CONNECT** permission');
      if (!permissions.has('SPEAK'))
        return message.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission!');
      await vc.join()
        .then(connection => {
          connection.voice.setSelfDeaf(true);
          return connection;
        })
        .catch(message.channel.send);
    } else return message.reply('you have to be in a voice channel moron');
  } else if (message.member.voice.channelID !== message.guild.voice.channelID)
    return message.reply("I'm already in a voice channel");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'join',
  description: 'Joins the voice channel',
  usage: 'join'
};
