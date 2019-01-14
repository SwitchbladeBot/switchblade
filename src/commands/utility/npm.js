const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures

const npm = require('api-npm')

module.exports = class Npm extends Command {
  constructor (client) {
    super(client)
    this.name = 'npm'
    this.category = 'utility'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, fullJoin: '-', missingError: 'commands:npm.noNameProvided' })
    )
  }

  run ({ t, author, channel }, pkg) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    npm.getdetails(pkg, data => {
      if (data.name) {
        const description = data.description || t('commands:npm.noDescription')
        embed.setColor(Constants.NPM_COLOR)
          .setAuthor(data.name, 'https://i.imgur.com/24yrZxG.png', `https://www.npmjs.com/package/${data.name}`)
          .setDescription(`${description}\nhttps://www.npmjs.com/package/${data.name}\n\n\`npm i ${data.name} --save\``)
      } else {
        throw new CommandError(t('commands:npm.notFound'), true)
      }
      channel.send(embed).then(() => channel.stopTyping())
    })
  }
}
