const { Command, SwitchbladeEmbed, Constants } = require('../../')

const { Attachment } = require('discord.js')
const fetch = require('node-fetch')

module.exports = class FiveM extends Command {
  constructor (client) {
    super(client, {
      name: 'fivem',
      category: 'games',
      parameters: [{
        type: 'string', missingError: 'commands:fivem.noIP'
      }]
    })
  }

  async run ({ t, author, channel }, address) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const host = address.split(':')[0]
    const port = address.split(':')[1] || 30120
    const server = await fetch(`http://${host}:${port}/info.json`).then(res => res.json()).catch(() => {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:samp.serverUnreachableTitle'))
        .setDescription(t('commands:samp.serverUnreachableDescription'))
      channel.send(embed).then(channel.stopTyping())
    })

    if (server) {
      const serverData = JSON.parse(server.body)
      const imageData = Buffer.from(serverData.icon.replace(/^data:image\/([\w+]+);base64,([\s\S]+)/, ''), 'base64')
      await this.getAllServers().then(function (servers) {
        for (let serv of servers) {
          if (serv.EndPoint === `${host}:${port}`) serverData.data = serv.Data
        }
      })
      embed.setAuthor('FiveM', 'https://i.imgur.com/u5wzB9A.png')
        .setTitle(serverData.data.hostname)
        .setURL(`https://servers.fivem.net/#/servers/detail/${host}:${port}`)
        .attachFile(new Attachment(imageData, 'serverIcon.png'))
        .setThumbnail('attachment://serverIcon.png')
        .addField(t('commands:fivem.address'), `\`${host}:${port}\``, true)
        .addField(t('commands:fivem.version'), serverData.version, true)
        .addField(t('commands:fivem.players'), `${serverData.data.players.length}/${serverData.vars.sv_maxClients}`, true)
        .addField(t('commands:fivem.map'), serverData.data.mapname || t('commands:fivem.noMap'), true)
        .addField(t('commands:fivem.gameMode'), serverData.data.gametype || t('commands:fivem.noGameMode'), true)
        .addField(t('commands:fivem.gameName'), serverData.data.gamename || t('commands:fivem.noGameName'), true)
      channel.send(embed).then(channel.stopTyping())
    }
  }

  getAllServers () {
    return new Promise(function (resolve, reject) {
      fetch('http://servers-live.fivem.net/api/servers/')
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
    })
  }
}
