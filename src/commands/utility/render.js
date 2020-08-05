const { Command, CommandError, SwitchbladeEmbed } = require('../../')

module.exports = class Move extends Command {
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
    try {
      if (!link.channel.permissionsFor(this.client.user.id).has('VIEW_CHANNEL')) throw new CommandError(t('commands:render.iDontHavePermissionToRead'))
      if (!link.channel.permissionsFor(author.id).has('VIEW_CHANNEL')) throw new CommandError(t('commands:render.youDontHavePermissionToRead'))

      const MessageObj = {}
      let content = link.content
      let messageHasNoEmbed = true

      if (link.attachments.size >= 1) {
        MessageObj.files = [link.attachments.first().url]
      }

      if (link.embeds.length >= 1) {
        messageHasNoEmbed = false
        MessageObj.embed = {};
        ['fields', 'title', 'description', 'url', 'timestamp', 'color', 'image', 'thumbnail', 'author'].forEach(p => {
          MessageObj.embed[p] = link.embeds[0][p]
        })
      }

      if (Object.keys(MessageObj).length === 0 && (!content || content === '')) {
        throw new CommandError(t('errors:messageContainsNothing'))
      }

      if (messageHasNoEmbed) {
        const embed = new SwitchbladeEmbed(author)
          .setAuthor(author.username, author.displayAvatarURL({ dynamic: true }))

        if (content) {
          embed.setDescription(content || '')
        }

        if (MessageObj.files) {
          await embed.setImage(MessageObj.files[0])
          delete MessageObj.files
        }
        MessageObj.embed = embed
      }

      message.channel.send('', MessageObj)
    } catch (e) {
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
