const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const query = require('samp-query')

module.exports = class SAMP extends Command {
  constructor (client) {
    super(client, {
      name: 'samp',
      category: 'games',
      parameters: [{
        type: 'string', missingError: 'commands:samp.noIP'
      }]
    })
  }

  async run ({ t, author, channel }, address) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const [ host, port = 7777 ] = address.split(':')
    try {
      const response = await this.queryPromise({ host, port })
      embed.setAuthor('San Andreas: Multiplayer', 'https://i.imgur.com/QYeGxrV.png')
        .setColor(0xF07B0F)
        .setTitle(response.hostname)
        .setURL(this.cleanURL(response.rules.weburl))
        .addField(t('commands:samp.address'), `\`${host}:${port}\``, true)
        .addField(t('commands:samp.version'), response.rules.version, true)
        .addField(t('commands:samp.players'), `${response.online}/${response.maxplayers}`, true)
        .addField(t('commands:samp.map'), response.mapname, true)
        .addField(t('commands:samp.gameMode'), response.gamemode, true)
        .addField(t('commands:samp.time'), response.rules.worldtime, true)
    } catch (err) {
      throw new CommandError(new SwitchbladeEmbed(author)
        .setTitle(t('commands:samp.serverUnreachableTitle'))
        .setDescription(t('commands:samp.serverUnreachableDescription')))
    }
    channel.send(embed).then(channel.stopTyping())
  }

  async queryPromise (options) {
    return new Promise((resolve, reject) => {
      query(options, function (error, response) {
        if (error) return reject(error)
        resolve(response)
      })
    })
  }

  cleanURL (url) {
    return /^https?:\/\//i.test(url) ? url : `http://${url}`
  }
}
