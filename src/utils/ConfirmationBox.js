const SwitchbladeEmbed = require('../structures/SwitchbladeEmbed')

module.exports = async (author, channel, content) => {
  const msg = await channel.send(new SwitchbladeEmbed(author).setAuthor(content))

  await msg.react('✅')
  await msg.react('❌')

  const collector = msg.createReactionCollector((reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === author.id)

  return new Promise((resolve) => {
    collector.on('collect', r => {
      switch (r.emoji.name) {
        case '✅':
          resolve(true)
          break
        case '❌':
          resolve(false)
          break
      }
    })
  })
}
