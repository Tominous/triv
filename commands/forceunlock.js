exports.run = (client, message, args) => {
  const chan = message.guild.channels.cache.find(channel => channel.id === args[0]);
  if (!chan) return message.reply('please specify a valid channel id');
  chan
    .updateOverwrite(chan.guild.roles.everyone, { SEND_MESSAGES: null })
    .then(message.channel.send('successfully unlocked'))
    .catch(client.logger.error);
  chan.send(`force unlocked by ${message.author}`);
  if (!client.lockit || !client.lockit[chan.id]) return;
  delete client.lockit[chan.id];
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['fu'],
  permLevel: 3
};

exports.help = {
  name: 'forceunlock',
  description: 'This will allow admins to unlock a channel from another channel',
  usage: 'forceunlock [channel id]'
};
