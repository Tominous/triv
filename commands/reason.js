async function embedSan(embed) {
  embed.message ? delete embed.message : null;
  embed.footer ? delete embed.footer.embed : null;
  embed.provider ? delete embed.provider.embed : null;
  embed.thumbnail ? delete embed.thumbnail.embed : null;
  embed.image ? delete embed.image.embed : null;
  embed.author ? delete embed.author.embed : null;
  embed.fields
    ? embed.fields.forEach(f => {
      delete f.embed;
    })
    : null;
  return embed;
}

exports.run = async (client, message, args) => {
  const botlog = message.guild.channels.cache.find(channel => channel.name === 'bot-logs'),
    caseNumber = args.shift(),
    newReason = args.join(' ');
  if (!botlog) return message.channel.send('there isn\'t even a bot-logs channel');
  await botlog.messages.fetch({ limit: 100 }).then(messages => {
    const caseLog = messages
      .filter(
        m =>
          m.author.id === client.user.id &&
          m.embeds[0] &&
          m.embeds[0].type === 'rich' &&
          m.embeds[0].footer &&
          m.embeds[0].footer.text.startsWith(`ID ${caseNumber}`)
      )
      .first();
    botlog.messages.fetch(caseLog.id).then(logMsg => {
      const embed = logMsg.embeds[0];
      embedSan(embed);
      embed.description = embed.description.replace(
        `Awaiting moderator's input. Use ${client.settings.prefix}reason ${caseNumber} <reason>.`,
        newReason
      );
      logMsg.edit({ embed });
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'reason',
  description: "Updates a moderation action's reason.",
  usage: 'reason [case number] [new reason]'
};
