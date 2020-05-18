const { Command, SwitchbladeEmbed, CommandError } = require('../../')
const Discord = require('discord.js')

module.exports = class Move extends Command {
  constructor (client) {
    super({
      name: 'move',
      aliases: ['mover'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_MESSAGES'], permissions: ['MANAGE_MESSAGES'] },
      parameters: [{
        type: 'messageLink', sameGuildOnly: true, returnIfExists: true, forceExists: true, missingError: 'commands:move.missingMessageLink'
      }, {
        type: 'channel', onlySameGuild: true, acceptText: true, missingError: 'commands:move.missingChannelMention'
      }]
    }, client)
  }

  async run ({ channel, guild, author, t, message }, link, destinationChannel) {
    /*
    The bot and the one who wants to move the message
    needs to have MANAGE_MESSAGES permission, the bot
    because he needs to delete the message, and the
    one who wants to move because how else would you
    move a message if this command din't exist?

    Now, we need to see if the user has permission to
    send messages in the channel he wants to move the
    message to and if the bot can send the messages
    there too, because switchblade bot does not check
    if the channel that the user sent is one that the
    bot can access.

    If the message, that the author wants to move, has
    embed, we'll also need EMBED_LINKS permission on the
    channel, but I don't think the author needs it. ~ Zerinho6
    */

    // const guildId = link[1]
    const embed = new SwitchbladeEmbed(author)
    if (!destinationChannel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) {
      throw new CommandError('commands:move.cantSendInChannel')
    }

    try {
      if (link.channel.nsfw && !destinationChannel.nsfw) {
        throw new CommandError('commands:move.channelsHaveDifferentType')
      }

      if (!link.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) {
        throw new CommandError('commands:move.cantDeleteMessage')
      }

      if (!link.channel.permissionsFor(author.id).has('SEND_MESSAGES')) {
        throw new CommandError('commands:move.userCantSend')
      }

      try {
        destinationChannel.send(t('commands:move.messageMoved', { authorName: link.author.username, movedFrom: link.channel.name, movedBy: author.username }))

        if (link.content.length >= 1) {
          destinationChannel.send(link.content)
        }

        if (link.attachments.size >= 1) {
          destinationChannel.send(new Discord.Attachment(message.attachments.first().url))
        }

        if (link.embeds.length >= 1) {
          if (!link.channel.permissionsFor(this.client.user.id).has('EMBED_LINKS')) {
            throw new CommandError('commands:move.cantSendEmbed')
          }

          ['fields', 'title', 'description', 'url', 'timestamp', 'color', 'image', 'thumbnail', 'author'].forEach(p => {
            embed[p] = link.embeds[0][p]
          })
          // Thanks for the suggestion, mete. ~ Zerinho6

          destinationChannel.send(embed)
        }
        link.delete()
      } catch (e) {
        throw new CommandError('commands:move.couldntSendMessage')
      }
    } catch (e) {
      throw new CommandError('commands:move.couldntSendMessage')
    }
  }
}
