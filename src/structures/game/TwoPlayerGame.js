const Constants = require('../../utils/Constants')
const SwitchbladeEmbed = require('../SwitchbladeEmbed')
const Game = require('./Game')

const CONFIRMATION_EMOJI = '✅'
const COLLECTOR_TIMEOUT = 30

module.exports = class TwoPlayerGame extends Game {
  constructor (options, context, opponent) {
    super(options, context)

    this.host = context.author
    this.opponent = opponent
  }

  async challengeOpponent () {
    this.message = await this.channel.send(
      this.opponent,
      new SwitchbladeEmbed(this.host)
        .setAuthor(
          this.rootT('game:challenge.title', {
            player: this.host.username,
            gameName: this.displayName
          }),
          this.host.displayAvatarURL({ format: 'png' })
        )
        .setDescription([
          this.rootT('game:challenge.clickToAccept', { emoji: CONFIRMATION_EMOJI }),
          this.rootT('game:challenge.timeoutIn', { timeout: COLLECTOR_TIMEOUT })
        ].join('\n'))
    )

    await this.message.react(CONFIRMATION_EMOJI)
    const result = await this.message.awaitReactions(
      (r, u) => r.emoji.name === CONFIRMATION_EMOJI && u.id === this.opponent.id,
      {
        time: COLLECTOR_TIMEOUT * 1000,
        maxEmojis: 1
      }
    )

    await this.message.reactions.removeAll()

    if (!result.size) {
      await this.message.edit(
        new SwitchbladeEmbed(this.host)
          .setColor(Constants.ERROR_COLOR)
          .setTitle(this.rootT('game:challenge.timeout', { gameName: this.displayName }))
      )

      return false
    }

    return true
  }
}
