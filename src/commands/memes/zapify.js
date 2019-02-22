const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const COLLECTOR_TIMEOUT = 30

const humorEmoji = {
  happy: '😄',
  angry: '😠',
  sassy: '😏',
  sad: '😢',
  sick: '🤢'
}

const levelEmoji = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣']

module.exports = class Zapify extends Command {
  constructor (client) {
    super(client, {
      name: 'zapify',
      category: 'memes',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:zapify.noZap'
      }]
    })
  }

  async run ({ channel, author, t }, zap) {
    const humorMessage = await channel.send(
      new SwitchbladeEmbed(author)
        .setTitle(t('commands:zapify.chooseHumor'))
        .setDescription([
          `**${t('commands:zapify.pleaseReact', { COLLECTOR_TIMEOUT })}**`,
          Object.keys(humorEmoji).map(h => {
            return `${humorEmoji[h]} ${t(`commands:zapify.humors.${h}`)}`
          }).join('\n')
        ].join('\n\n'))
    )

    for (const e of Object.keys(humorEmoji)) {
      await humorMessage.react(humorEmoji[e])
    }

    const result = await humorMessage.awaitReactions((r, u) => {
      r.emoji.name
    }, { time: COLLECTOR_TIMEOUT * 1000, maxEmojis: 1 })
    channel.send(result.first())
  }
}