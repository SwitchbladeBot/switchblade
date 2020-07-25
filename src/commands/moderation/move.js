const { Command, CommandError } = require('../../')

module.exports = class Move extends Command {
  constructor (client) {
    super({
      name: 'move',
      aliases: ['mover'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_MESSAGES'], permissions: ['MANAGE_MESSAGES'] },
      parameters: [{
        type: 'messageLink', sameGuildOnly: true, forceExists: true, missingError: 'commands:move.missingMessageLink'
      }, {
        type: 'channel', onlySameGuild: true, acceptText: true, missingError: 'commands:move.missingChannelMention'
      }]
    }, client)
  }

  async run ({ channel, guild, author, t, message }, link, destinationChannel) {
    if (!destinationChannel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) throw new CommandError(t('commands:move.cantSendInChannel'))

    try {
      if (link.channel.nsfw && !destinationChannel.nsfw) throw new CommandError(t('commands:move.channelsHaveDifferentType'))

      if (!link.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) throw new CommandError(t('commands:move.cantDeleteMessage'))

      if (!destinationChannel.permissionsFor(author.id).has('SEND_MESSAGES')) throw new CommandError(t('commands:move.userCantSend'))

      const MessageObj = {}
      let content = link.content

      if (link.attachments.size >= 1) {
        MessageObj.files = [link.attachments.first().url]
      }

      if (link.embeds.length >= 1) {
        if (!destinationChannel.permissionsFor(this.client.user.id).has('EMBED_LINKS')) throw new CommandError(t('commands:move.cantSendEmbed'))
        MessageObj.embed = {};
        ['fields', 'title', 'description', 'url', 'timestamp', 'color', 'image', 'thumbnail', 'author'].forEach(p => {
          MessageObj.embed[p] = link.embeds[0][p]
        })
      }

      if (Object.keys(MessageObj).length === 0 && (!content || content === '')) {
        throw new CommandError(t('errors:messageContainsNothing'))
      }

      await destinationChannel.send(content, MessageObj)
      await destinationChannel.send(t('commands:move.messageMoved', { authorName: link.author.username, movedFrom: link.channel.name, movedBy: author.username }))
      link.delete()
    } catch (e) {
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
