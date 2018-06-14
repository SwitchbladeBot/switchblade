const { Command, SwitchbladeEmbed, Constants } = require('../../')
const npm = require('api-npm')

module.exports = class Npm extends Command {
  constructor (client) {
    super(client)
    this.name = 'npm'
  }

  run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)
    if (args[0]) {
      npm.getdetails(args.join('-'), data => {
        if (data.name) {
          const description = data.description || t('commands:npm.noDescription')
          embed
            .setAuthor(data.name, 'https://i.imgur.com/24yrZxG.png', `https://www.npmjs.com/package/${data.name}`)
            .setDescription(`${description}\nhttps://www.npmjs.com/package/${data.name}\n\n\`npm i ${data.name} --save\``)
        } else {
          embed
            .setColor(Constants.ERROR_COLOR)
            .setAuthor(t('commands:npm.notFound'))
            .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:npm.commandUsage')}`)
        }
        message.channel.send({ embed })
      })
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setAuthor(t('commands:npm.noNameProvided'))
        .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:npm.commandUsage')}`)
      message.channel.send({ embed })
    }
  }
}
