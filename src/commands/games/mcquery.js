/* eslint-disable no-control-regex */
const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const net = require('net')

module.exports = class MCQuery extends Command {
  constructor (client) {
    super(client)
    this.name = 'mcquery'
    this.category = 'games'
    this.aliases = ['minecraftquery']
    this.parameters = new CommandParameters(this,
      new StringParameter({ missingError: 'commands:mcquery.noIP' })
    )
  }
  async run ({ t, author, channel }, server) {
    let [ address, port = 25565 ] = server.split(':')

    let info = await this.getInfo(address, port)
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (info.online) {
      if (port === '25565') {
        embed
          .setTitle(`${address}`)
          .setDescription(`**${t('commands:mcquery.status')}:** \`${t('commands:mcquery.online')}\`\n**${t('commands:mcquery.messageOfTheDay')}:** \`${info.motd}\`\n**${t('commands:mcquery.players')}**: \`${info.currentPlayers}/${info.maxPlayers}\`\n**${t('commands:mcquery.version')}**: \`${info.version}\``)
      } else {
        embed
          .setTitle(`${address}:${port}`)
          .setDescription(`**${t('commands:mcquery.status')}:** \`${t('commands:mcquery.online')}\`\n**${t('commands:mcquery.messageOfTheDay')}:** \`${info.motd}\`\n**${t('commands:mcquery.players')}**: \`${info.currentPlayers}/${info.maxPlayers}\`\n**${t('commands:mcquery.version')}**: \`${info.version}\``)
      }
    } else if (info.timeout) {
      embed
        .setTitle(t('commands:mcquery.unknownServer'))
        .setColor(Constants.ERROR_COLOR)
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
  cleanMOTD (motd) {
    let cleanMotd = motd.replace(/�./g, '')
    return cleanMotd
  }
  getInfo (address, port) {
    return new Promise((resolve) => {
      // Minestat code.
      let info = { address, port }
      const netClient = net.connect(port, address, () => {
        let buff = Buffer.from([0xFE, 0x01])
        netClient.write(buff)
      })

      netClient.setTimeout(6000)

      netClient.on('data', (data) => {
        if (data !== null && data !== '') {
          let serverInfo = data.toString().split(`\x00\x00\x00`)
          if (serverInfo !== null && serverInfo.length >= 6) {
            info.online = true
            info.version = serverInfo[2].replace(/\u0000/g, '')
            info.motd = this.cleanMOTD(serverInfo[3].replace(/\u0000/g, ''))
            info.currentPlayers = serverInfo[4].replace(/\u0000/g, '')
            info.maxPlayers = serverInfo[5].replace(/\u0000/g, '')
          } else {
            info.online = false
          }
        }
        resolve(info)
        netClient.end()
      })
      netClient.on('timeout', () => {
        resolve({ timeout: true })
        netClient.end()
      })
      netClient.on('error', (err) => {
        resolve({ timeout: true, err: err })
      })
    })
  }
}
