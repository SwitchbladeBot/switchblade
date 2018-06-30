const { CommandStructures, SwitchbladeEmbed } = require('../../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Deezer extends Command {
  constructor (client) {
    super(client)

    this.name = 'fortnite'
    this.aliases = ['ftn']
    this.parameters = new CommandParameters(this,
      new StringParameter({full: false, missingError: 'commands:fortnite.missingPlatform'}),
      new StringParameter({full: true, missingError: 'commands:fortnite.missingNickname'})
    )
  }

  canLoad () {
    return !!this.client.apis.fortnite
  }

  async run ({ t, author, channel }, platform, nickname) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      const player = await this.client.apis.fortnite.checkPlayer(nickname, platform)
      console.log(player)
    } catch (e) {
      console.log(e)
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
