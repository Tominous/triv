const fetch = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  const user = message.mentions.users.first();
  if (!user) return message.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  const m = await message.channel.send('Getting...');
  let data;
  try {
    data = await fetch.get(`https://verify.eryn.io/api/user/${user.id}`);
  } catch {
    
  }
  if (!data) {
    try {
      data = await fetch.get(`https://api.blox.link/v1/user/${user.id}`);
    } catch {
      return m.edit('I was unable to find a Roblox account linked with that user');
    }
  }
  m.edit('', new MessageEmbed()
    .setTitle(data.body.robloxUsername)
    .setDescription(`https://roblox.com/users/${data.body.robloxId}/profile`)
    .setColor(0x00ae86)
  );
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'roblox',
  description: "Attempts to get a discord user's roblox username",
  usage: 'roblox [discord user]'
};
