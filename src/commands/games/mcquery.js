/* eslint-disable no-control-regex */
const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

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
    let address = server.split(':')
    let port = 25565
    if (address.length === 2) port = address[1]

    let info = await this.getInfo(address[0], port)
    let embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (info.online) {
      embed.setTitle(`${address[0]}:${port}`)
      embed.setDescription(`**${t('commands:mcquery.stats')}:** \`${t('commands:mcquery.online')}\`\n**${t('commands:mcquery.messageOfTheDay')}:** \`${info.motd}\`\n**${t('commands:mcquery.players')}**: \`${info.currentPlayers}/${info.maxPlayers}\`\n**${t('commands:mcquery.version')}**: \`${info.version}\``)
    } else if (info.timeout) {
      embed.setTitle(t('commands:mcquery.unknownServer'))
      embed.setColor(Constants.ERROR_COLOR)
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
  cleanMOTD (motd) {
    let cleanMotd = motd.split('')
    motd.split('').forEach((char, i) => {
      if (char === '�') {
        cleanMotd[i] = ''
        cleanMotd[parseInt(i) + 1] = ''
      }
    })
    return cleanMotd.join('')
  }
  getInfo (address, port) {
    return new Promise((resolve) => {
      // Minestat code.
      let info = {}
      info.address = address
      info.port = port
      const net = require('net')
      const client = net.connect(port, address, () => {
        let buff = Buffer.from([0xFE, 0x01])
        client.write(buff)
      })

      client.setTimeout(6000)

      client.on('data', (data) => {
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
        client.end()
      })
      client.on('timeout', () => {
        resolve({ timeout: true })
        client.end()
      })
      client.on('error', (err) => {
        resolve({ timeout: true, err: err })
      })
    })
  }
}
