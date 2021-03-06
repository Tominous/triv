const { MessageEmbed } = require('discord.js');
exports.run = (client, message) => {
  client
    .generateInvite({ permissions: 2146958591 })
    .then(link => {
      const embed = new MessageEmbed()
        .setColor(0x00ae86)
        .setTitle(client.user.username)
        .setURL(link)
        .setDescription(`[Invite me](${link})`);
      message.channel.send(embed);
    })
    .catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['inv'],
  permLevel: 0
};

exports.help = {
  name: 'invite',
  description: 'Gives you an invite link for me.',
  usage: 'invite',
  example: 'invite'
};
