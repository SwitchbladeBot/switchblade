const { Command, CommandError } = require('../../')

module.exports = class Move extends Command {
  constructor (client) {
    super({
      name: 'move',
      aliases: ['mover'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_MESSAGES'], permissions: ['MANAGE_MESSAGES'] },
      parameters: [{
        type: 'messageLink',
        sameGuildOnly: true,
        forceExists: true,
        linkChannelUserPermission: ['VIEW_MESSAGES'],
        linkChannelBotPermission: ['MANAGE_MESSAGES'],
        missingError: 'commands:move.missingMessageLink'
      }, {
        type: 'channel',
        onlySameGuild: true,
        acceptText: true,
        channelUserPermission: ['SEND_MESSAGES'],
        channelBotPermission: ['SEND_MESSAGES', 'EMBED_LINKS'],
        missingError: 'commands:move.missingChannelMention'
      }]
    }, client)
  }

  async run ({ channel, guild, author, t, message }, link, destinationChannel) {
    if (link.channel.nsfw && !destinationChannel.nsfw) throw new CommandError(t('commands:move.channelsHaveDifferentType'))

    const messageObj = {}
    const content = link.content

    if (link.attachments.size >= 1) {
      messageObj.files = [link.attachments.array()]
    }

    if (link.embeds.length >= 1) {
      messageObj.embed = {};
      ['fields', 'title', 'description', 'url', 'timestamp', 'color', 'image', 'thumbnail', 'author'].forEach(p => {
        messageObj.embed[p] = link.embeds[0][p]
      })
    }

    if (Object.keys(messageObj).length === 0 && (!content || content === '')) {
      throw new CommandError(t('errors:messageContainsNothing'))
    }

    try {
      await destinationChannel.send(content, messageObj)
      await destinationChannel.send(t('commands:move.messageMoved', { authorName: link.author.username, movedFrom: link.channel.name, movedBy: author.username }))
      link.delete()
    } catch (e) {
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
