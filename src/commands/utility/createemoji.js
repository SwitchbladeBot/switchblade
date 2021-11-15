const { Command, CommandError, SwitchbladeEmbed } = require('../../')

module.exports = class CreateEmoji extends Command {
  constructor (client) {
    super({
      name: 'createemoji',
      aliases: ['newemoji'],
      category: 'utility',
      requirements: { guildOnly: true, permissions: ['MANAGE_EMOJIS'], botPermissions: ['MANAGE_EMOJIS'] },
      parameters: [{
        type: 'url',
        full: false,
        missingError: 'commands:createemoji.noImage'
      }, {
        type: 'string',
        missingError: 'commands:createemoji.noName'
      }]
    }, client)
  }

  async run ({ t, channel, author, guild }, url, name) {
    const embed = new SwitchbladeEmbed(author)

    try {
      const emoji = await guild.emojis.create(url.href, name)

      embed.setDescription(t('commands:createemoji.created', { emoji }))
        .setThumbnail(url)

      channel.send({ embeds: [embed] })
    } catch (e) {
      throw new CommandError(`${t('commands:createemoji.error')}\n${e.toString()}`)
    }
  }
}
