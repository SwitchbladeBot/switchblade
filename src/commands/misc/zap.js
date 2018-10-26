const { CommandStructures, SwitchbladeEmbed } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class Zap extends Command {
  constructor (client) {
    super(client)
    this.name = 'zap'
    this.aliases = ['zapeador', 'zapear']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:zap.missingZap' })
    )
  }

  async run ({ author, channel }, zap) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.post('http://vemdezapbe.be/api/v1.0/zap').send({
      zap,
      tweet: false,
      strength: Math.round(Math.random() * 5),
      rate: 1,
      mood: ['angry', 'happy', 'sad', 'sassy', 'sick'][Math.floor(Math.random() * 5)]
    })
    embed
      .setTitle(body.zap)
      .setDescription(body.gemidao || '')
    channel.send(embed).then(() => channel.stopTyping())
  }
}
