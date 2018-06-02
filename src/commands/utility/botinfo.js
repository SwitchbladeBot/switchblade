const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class BotInfo extends Command {
  constructor (client) {
    super(client)
    this.name = 'botinfo'
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    const nf = new Intl.NumberFormat('en-US').format
    const os = require('os')
    message.channel.startTyping()
    embed.setAuthor(this.client.user.username, this.client.user.avatarURL, 'https://switchblade.js.org')
      .addField('General Data', `Guilds: **${nf(this.client.guilds.size)}**\nChannels: **${nf(this.client.channels.size)}**\nUsers: **${nf(this.client.users.size)}**`, true)
      .addField('Technical Data', `Discord.js Version: **v${require('discord.js').version}**\nNode Version: **${process.version}**`, true)
      .addField('Machine Data', `CPU: **${os.cpus().length}x ${os.cpus()[0].model}**\nOS: **${os.type()} ${os.arch()}**`)
      .addField('Connection Speeds', 'Testing...', true)
    message.channel.send(embed).then(async function (m) {
      const { testSpeed } = require('speedtest-promise')
      const result = await testSpeed({maxTime: 5000})
      embed.fields[3].value = `Ping: **${result.ping}ms**\nDownload: **${result.speeds.download}Mb**\nUpload: **${result.speeds.upload}Mb**`
      m.edit(embed)
      message.channel.stopTyping()
    })
  }
}
