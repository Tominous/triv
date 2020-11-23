const settings = require('../settings.json');
const { MessageEmbed } = require("discord.js");
const Genius = require("genius-lyrics");
const GClient = new Genius.SongsClient(settings.genius_api_key);

exports.run = async (client, message, args) => {
  const queue = client.queue.get(message.guild.id);
  if (!queue)
    return message.reply("there is nothing playing.").catch(client.logger.error);

  let lyrics = null;
  
  const songtitle = queue.songs[0].title.replace(/\([^()]*\)/g, '');
  
  try {
    const search = await GClient.search(songtitle);
    lyrics = await search[0].lyrics(false);
    if (!lyrics) lyrics = `No lyrics found for ${songtitle}.`;
  } catch (error) {
    client.logger.error(error);
    lyrics = `No lyrics found for ${songtitle}.`;
  }

  const lyricsEmbed = new MessageEmbed()
    .setTitle('Lyrics - ' + songtitle)
    .setDescription(lyrics)
    .setColor("#F8AA2A");

  for (i = 0; i*2000 <= lyrics.length; i++) {
    lyricsEmbed.description = `${lyrics.substr(i*2000, i*2000+2000)}`;
    message.channel.send(lyricsEmbed).catch(client.logger.error);
  }
};

  exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'lyrics',
  description: 'Gets the lyrics for the currently playing song',
  usage: 'lyrics'
};
