const path = require('path'),
  fs = require('fs'),
  sounds = fs.readdirSync(path.join(process.cwd(), 'assets', 'airhorn'));

exports.run = async (client, msg) => {
  if (!msg.guild.voice || !msg.guild.voice.connection) 
    await client.commands.get('join').run(client, msg);
  else if (msg.member.voice.channelID !== msg.guild.voice.channelID)
    return msg.reply("I'm already in a voice channel");
  const airhorn = sounds.random();
  await msg.guild.voice.connection.play(path.join(process.cwd(), 'assets', 'airhorn', airhorn));
  if (msg.channel.permissionsFor(client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
    try {
      await msg.react('🔉');
    } catch {
      return;
    }
  }
  await client.wait(5000);
  msg.member.voice.channel.leave();
};
    
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'airhorn',
  description: 'Plays an airhorn sound',
  usage: 'airhorn'
};