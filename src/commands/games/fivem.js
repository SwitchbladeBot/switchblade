const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class FiveM extends Command {
  constructor (client) {
    super({
      name: 'fivem',
      category: 'games',
      parameters: [{
        type: 'string', clean: true, missingError: 'commands:fivem.noIP'
      }]
    }, client)
  }

  async run ({ t, author, channel }, address) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const id = address.replace(/(http(s?):\/\/)?(cfx.re\/join\/)/g, '')
    const server = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${id}`)
      .then(res => res.json())
      .then(data => data.Data)
      .catch(() => {
        throw new CommandError(`${t('commands:fivem.serverUnreachableTitle')} ${t('commands:fivem.serverUnreachableDescription')}`)
      })

    if (server) {
      embed.setAuthor('FiveM', 'https://i.imgur.com/u5wzB9A.png')
        .setTitle(`${server.hostname.replace(/\|/g, '\\|').substring(0, 253)}...`)
        .setURL(`https://servers.fivem.net/servers/detail/${id}`)
        .setThumbnail(`https://servers-live.fivem.net/servers/icon/${id}/${server.iconVersion}.png`)
        .addField(t('commands:fivem.address'), `\`cfx.re/join/${id}\``, true)
        .addField(t('commands:fivem.players'), `${server.players.length}/${server.sv_maxclients}`, true)
        .addField(t('commands:fivem.map'), server.mapname || t('commands:fivem.noMap'), true)
        .addField(t('commands:fivem.gameMode'), server.gametype || t('commands:fivem.noGameMode'), true)
        .addField(t('commands:fivem.gameName'), server.vars.gamename || t('commands:fivem.noGameName'), true)

      if (server.vars.banner_detail || server.vars.banner_connecting) {
        embed.setImage(server.vars.banner_detail ? server.vars.banner_detail : (server.vars.banner_connecting ? server.vars.banner_connecting : null))
      }

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
