const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const query = require('samp-query')

module.exports = class SAMP extends Command {
  constructor (client) {
    super(client)
    this.name = 'samp'

    this.parameters = new CommandParameters(this,
      new StringParameter({missingError: 'commands:samp.noIP'})
    )
  }

  async run ({ t, author, channel }, address) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const host = address.split(':')[0]
    const port = address.split(':')[1] || 7777
    try {
      const response = await this.queryPromise({host, port})
      embed.setAuthor('San Andreas: Multiplayer', 'http://1.bp.blogspot.com/-AY3d9tMV8nM/Ton8LlgoJgI/AAAAAAAAAMg/VFID_9mI-Co/s1600/SAMP.png')
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
      embed.setColor(Constants.ERROR_COLOR)
      if (err === 'Host unavailable') {
        embed.setTitle(t('commands:samp.serverUnreachableTitle'))
          .setDescription(t('commands:samp.serverUnreachableDescription'))
      } else {
        embed.setTitle(t('errors:generic'))
          .setDescription(`\`${err}\``)
      }
    }
    channel.send(embed).then(channel.stopTyping())
  }

  static queryPromise (options) {
    return new Promise((resolve, reject) => {
      query(options, function (error, response) {
        if (error) reject(error)
        else resolve(response)
      })
    })
  }

  static cleanURL (url) {
    if (!/^https?:\/\//i.test(url)) return 'http://' + url
    return url
  }
}
