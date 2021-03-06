async function caseNumber(client, botlog) {
  const messages = await botlog.messages.fetch({ limit: 16 });
  const log = messages
    .filter(
      m =>
        m.author.id === client.user.id &&
        m.embeds[0] &&
        m.embeds[0].type === 'rich' &&
        m.embeds[0].footer &&
        m.embeds[0].footer.text.startsWith('ID')
    )
    .first();
  if (!log) return 1;
  const thisCase = /ID\s(\d+)/.exec(log.embeds[0].footer.text);
  return thisCase ? parseInt(thisCase[1]) + 1 : 1;
}

module.exports = { caseNumber };
