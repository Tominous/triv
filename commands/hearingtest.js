const path = require('path');
const data = require('../assets/hearing-test.json');

exports.run = async (client, msg) => {
  try {
    let age;
    let range;
    let previousAge = 'all';
    let previousRange = 8;
    for (const { age: dataAge, khz, file } of data) {
      if (!msg.guild.voice || !msg.guild.voice.connection) {
        const vc = msg.member.voice.channel;

        if (vc) {
          const permissions = vc.permissionsFor(client.user);
          if (!permissions.has('CONNECT'))
            return msg.reply('cannot connect to voice channel, missing the **CONNECT** permission');
          if (!permissions.has('SPEAK'))
            return msg.reply('I cannot speak in this voice channel, make sure I have the **SPEAK** permission!');
          await vc.join()
            .then(connection => {
              connection.voice.setSelfDeaf(true);
            })
            .catch(msg.channel.send);
        } else return msg.reply('you have to be in a voice channel moron');
      }
      else if (msg.member.voice.channelID !== msg.guild.voice.channelID)
        return msg.reply("I'm already in a voice channel");
      msg.guild.voice.connection.play(path.join(__dirname, '..', 'assets', file));
      await client.wait(3500);
      msg.channel.send('Did you hear that sound? Reply with **[y]es** or **[n]o**.');
      const heard = await client.verify(msg.channel, msg.author);
      if (!heard || file === data[data.length - 1].file) {
        age = previousAge;
        range = previousRange;
        break;
      }
      previousAge = dataAge;
      previousRange = khz;
    }
    msg.member.voice.channel.leave();
    if (age === 'all')
      return msg.channel.send('Everyone should be able to hear that. You cannot hear.');
    if (age === 'max') 
      return msg.channel.send(`You can hear any frequency of which a human is capable. The maximum frequency you were able to hear was **${range}000hz**.`);
    return msg.channel.send(`You have the hearing of someone **${Number.parseInt(age, 10) + 1} or older**. The maximum frequency you were able to hear was **${range}000hz**.`);
  } catch (err) {
    client.logger.error(err.stack);
    return msg.reply(`oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['hearing', 'hear'],
  permLevel: 0
};

exports.help = {
  name: 'hearingtest',
  description: 'Tests your hearing',
  usage: 'hearingtest'
};