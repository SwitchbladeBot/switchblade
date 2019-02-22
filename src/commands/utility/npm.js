const { Command, SwitchbladeEmbed, Constants } = require('../../')

const npm = require('api-npm')

module.exports = class Npm extends Command {
  constructor (client) {
    super(client, {
      name: 'npm',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        fullJoin: '-',
        missingError: 'commands:npm.noNameProvided'
      }]
    })
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
        embed.setColor(Constants.ERROR_COLOR).setTitle(t('commands:npm.notFound'))
      }
      channel.send(embed).then(() => channel.stopTyping())
    })
  }
}
