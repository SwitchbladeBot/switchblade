const SwitchbladeEmbed = require('../structures/SwitchbladeEmbed')

module.exports = (author, channel, content) => {
  return new Promise(async (resolve) => {
    const msg = await channel.send(new SwitchbladeEmbed(author).setAuthor(content))

    await msg.react('✅')
    await msg.react('❌')

    const collector = msg.createReactionCollector((reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === author.id)
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
