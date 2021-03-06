module.exports = async (client, message) => {
  if (message.author.bot) return;
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention))
    return message.reply(`my prefix on this guild is \`${client.settings.prefix}\``);
  if (!message.content.startsWith(client.settings.prefix)) return;
  if (client.blacklist.includes(message.author.id)) {
    message.delete({ timeout: 1500 });
    const a = await message.reply('you are temporarily blacklisted');
    return a.delete({ timeout: 1500 });
  }
  const command = message.content.split(' ')[0].slice(client.settings.prefix.length).toLowerCase();
  const args = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command))
    cmd = client.commands.get(command);
  else if (client.aliases.has(command))
    cmd = client.commands.get(client.aliases.get(command));
  if (cmd) {
    if (!message.guild) {
      if (!cmd.conf.guildOnly) {
        if (cmd.conf.permLevel >= 10 && message.author.id !== client.settings.owner_id)
          return message.reply("you don't have the perms for that");
        return cmd.run(client, message, args, 4);
      } else if (cmd.conf.guildOnly)
        return message.reply('that command can only be used in a guild, get some friends.');
    }
    const perms = client.elevation(message);
    if (perms < cmd.conf.permLevel)
      return message.reply("you don't have the perms for that");
    cmd.run(client, message, args, perms);
  }
};
