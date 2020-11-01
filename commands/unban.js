exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  client.unbanReason = reason;
  client.unbanAuth = message.author;
  let user = args[0];
  let modlog = message.guild.channels.cache.find(
      channel => channel.name === 'bot-logs'
    );
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !modlog) {
    message.guild.channels.create('bot-logs', { type: 'text' });
  } elseif (!modlog) {
    return message.reply('I cannot find a bot-logs channel');
  }
  if (!user) return message.reply('You must supply a user ID.').catch(console.error);
  if (reason.length < 1) return message.reply('You must supply a reason for the unban.');
  message.guild.members.unban(user, {reason: reason});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'unban',
  description: 'Unbans the user.',
  usage: 'unban [mention] [reason]'
};
