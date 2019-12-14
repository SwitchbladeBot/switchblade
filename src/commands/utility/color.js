const { Command, SwitchbladeEmbed, CommandError } = require('../../')
const fetch = require('node-fetch')

module.exports = class ColorCommand extends Command {
  constructor (client) {
    super({
      name: 'color',
      category: 'utility',
      parameters: [{
        type: 'color',
        full: true,
        missingError: 'errors:invalidColor'
      }]
    }, client)
  }

  async run ({ t, author, channel }, color) {
    const hexcode = color.rgb(true, true)
    channel.startTyping()

    try {
      const colorInfo = await fetch(`http://www.thecolorapi.com/id?format=json&hex=${hexcode}`).then(r => r.json())
      const embed = new SwitchbladeEmbed(author)
      embed.setAuthor(colorInfo.name.value, `https://www.colourlovers.com/img/${hexcode}/50/50/Sminted.png`)
        .setColor(hexcode)
        .addField(t('commands:color:hex'), `\`${colorInfo.hex.value}\``, true)
        .addField(t('commands:color:rgb'), `\`${colorInfo.rgb.value}\``, true)
        .addField(t('commands:color:hsl'), `\`${colorInfo.hsl.value}\``, true)

      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
