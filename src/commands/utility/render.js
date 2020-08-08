const { Command, CommandError, SwitchbladeEmbed } = require('../../')
module.exports = class Render extends Command {
  constructor (client) {
    super({
      name: 'render',
      aliases: ['show'],
      category: 'utility',
      requirements: { guildOnly: true, botPermissions: ['EMBED_LINKS'] },
      parameters: [{
        type: 'messageLink', sameGuildOnly: true, forceExists: true, missingError: 'commands:move.missingMessageLink'
      }]
    }, client)
  }

  async run ({ author, t, message }, link) {
    if (!link.channel.permissionsFor(this.client.user.id).has('VIEW_CHANNEL')) throw new CommandError(t('commands:render.iDontHavePermissionToRead'))
    if (!link.channel.permissionsFor(author.id).has('VIEW_CHANNEL')) throw new CommandError(t('commands:render.youDontHavePermissionToRead'))

    const messageObj = {}
    const { content } = link
    let messageHasNoEmbed = true

    if (link.attachments.size >= 1) {
      messageObj.files = [link.attachments.first().url]
    }

    if (link.embeds.length >= 1) {
      messageHasNoEmbed = false
      messageObj.embed = link.embeds[0].toJSON()
    }

    if (Object.keys(messageObj).length === 0 && !content) {
      throw new CommandError(t('errors:messageContainsNothing'))
    }
    try {
      if (messageHasNoEmbed) {
        const embed = new SwitchbladeEmbed(author)
          .setAuthor(author.username, author.displayAvatarURL({ dynamic: true }))

        if (content) {
          embed.setDescription(content || '')
        }

        messageObj.embed = embed
      }

      message.channel.send('', messageObj)
    } catch (e) {
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
