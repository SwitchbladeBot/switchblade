const splitArgs = require('splitargs')

const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const UNICODE_ALPHABET = '🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿'.split(' ')

const EscapeMarkdown = (text) => text.replace(/(\*|~+|`)/g, '')

module.exports = class Poll extends Command {
  constructor (client) {
    super({
      name: 'poll',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:poll.noQuestion'
      }]
    }, client)
  }

  async run (context, args) {
    const { channel, author } = context

    channel.startTyping()

    const [question, ...options] = splitArgs(args)
    const embed = new SwitchbladeEmbed(author)

    const parsedQuestion = EscapeMarkdown(question)

    if (options.length) await this.createPollWithOptions(context, embed, parsedQuestion, options)
    else await this.createPoll(context, embed, parsedQuestion, options)

    channel.stopTyping()
  }

  async createPoll ({ channel }, embed, question, options) {
    embed.setTitle(`:ballot_box: ${question}`)

    const message = await channel.send(embed)

    await message.react('👍')
    await message.react('👎')
  }

  async createPollWithOptions ({ t, channel }, embed, question, options) {
    const maxOptions = UNICODE_ALPHABET.length

    if (options.length > maxOptions) {
      throw new CommandError(t('commands:poll.tooManyOptions', { maxOptions }))
    }

    let description = options
      .map((option, i) => `${UNICODE_ALPHABET[i]} ${option}`)
      .join('\n\n')

    const message = await channel.send(
      embed
        .setTitle(`:ballot_box: ${question}`)
        .setDescription(description)
    )

    for (let i = 0; i < options.length; i++) await message.react(UNICODE_ALPHABET[i])
  }
}
