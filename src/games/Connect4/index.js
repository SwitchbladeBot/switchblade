const { TwoPlayerGame, SwitchbladeEmbed, Constants } = require('../..')
const Board = require('./Board')
const Player = require('./Player')
const { NUMBERS } = require('./constants')

const COLLECTOR_TIMEOUT = 60

module.exports = class Connect4 extends TwoPlayerGame {
  constructor (context, opponent) {
    super({
      name: 'connect4'
    }, context, opponent)

    this.board = new Board()
    this.isPlaying = false

    this.playTimeout = null
  }

  preparePlayers () {
    this.players.push(new Player(this, this.host))
    this.players.push(new Player(this, this.opponent))

    this.players.shuffle()

    this.players.forEach((player, index) => {
      player.code = index + 1
    })
  }

  async start () {
    this.preparePlayers()

    const accepted = await this.challengeOpponent()

    if (!accepted) return

    await this.prepare()
  }

  async prepare () {
    await this.message.edit(
      '',
      new SwitchbladeEmbed(this.host)
        .setTitle(this.displayName)
        .setDescription(this.t('loading'))
    )

    this.collector = this.message.createReactionCollector(() => true)

    const onCollect = this.onCollect.bind(this)

    this.collector.on('collect', (reaction, user) => onCollect(reaction, user))

    for (let i = 0; i < NUMBERS.length; i++) await this.message.react(NUMBERS[i])

    await this.render()

    this.isPlaying = true

    this.setPlayTimeout()
  }

  async onCollect (reaction, user) {
    if (this.isPlaying && this.players.isCurrentPlayer(user.id)) {
      this.clearPlayTimeout()

      const column = NUMBERS.indexOf(reaction.emoji.name)

      if (column >= 0) {
        this.players.current.play(column)

        if (this.board.isColumnFull(column)) await reaction.remove()

        if (this.players.current.won()) {
          return this.showResult(this.t('win', { player: this.players.current }))
        }

        if (this.board.isFull()) return this.showResult(this.t('tie'))

        this.players.next()

        await this.render()

        this.setPlayTimeout()
      }
    }

    if (user.id !== this.client.user.id) await reaction.users.remove(user)
  }

  setPlayTimeout () {
    const timeout = this.timeout.bind(this)

    this.playTimeout = setTimeout(() => timeout(), COLLECTOR_TIMEOUT * 1000)
  }

  clearPlayTimeout () {
    if (this.playTimeout) {
      clearTimeout(this.playTimeout)
      this.playTimeout = null
    }
  }

  async render () {
    await this.message.edit(
      this.t('yourTurn', { player: this.players.current.user.toString() }),
      new SwitchbladeEmbed(this.host)
        .setTitle(this.displayName)
        .setDescription([
          this.board.render(),
          NUMBERS.join(''),
          '',
          `**${this.t('currentPlayer')}**: ${this.players.current}`,
          `(${this.t('clickTimeoutsIn', { timeout: COLLECTOR_TIMEOUT })})`
        ].join('\n'))
    )
  }

  async timeout () {
    this.clearPlayTimeout()

    this.isPlaying = false

    await this.message.edit(
      '',
      new SwitchbladeEmbed(this.host)
        .setColor(Constants.ERROR_COLOR)
        .setTitle(this.t('didNotPlay'))
    )

    this.collector.stop()

    await this.message.reactions.removeAll()
  }

  async showResult (message) {
    this.clearPlayTimeout()

    this.isPlaying = false

    await this.message.edit(
      '',
      new SwitchbladeEmbed(this.host)
        .setTitle(this.displayName)
        .setDescription([
          this.board.render(),
          message
        ].join('\n\n'))
    )

    this.collector.stop()

    await this.message.reactions.removeAll()
  }
}
