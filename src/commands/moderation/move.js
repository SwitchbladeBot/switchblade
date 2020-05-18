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
        type: 'messageLink', sameGuildOnly: true, forceExists: true, missingError: 'commands:move.missingMessageLink'
      }, {
        type: 'channel', onlySameGuild: true, acceptText: true, missingError: 'commands:move.missingChannelMention'
      }]
    }, client)
  }

  async run ({ channel, guild, author, t, message }, link, destinationChannel) {
    const embed = new SwitchbladeEmbed(author)
    if (!destinationChannel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) throw new CommandError(t('commands:move.cantSendInChannel'))

    try {
      if (link.channel.nsfw && !destinationChannel.nsfw) throw new CommandError(t('commands:move.channelsHaveDifferentType'))

      if (!link.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) throw new CommandError(t('commands:move.cantDeleteMessage'))

      if (!link.channel.permissionsFor(author.id).has('SEND_MESSAGES')) throw new CommandError(t('commands:move.userCantSend'))

      try {
        destinationChannel.send(t('commands:move.messageMoved', { authorName: link.author.username, movedFrom: link.channel.name, movedBy: author.username }))

        if (link.content.length >= 1 || link.attachments.size >= 1) await destinationChannel.send(link.content.length >= 1 ? link.content : '', link.attachments.size >= 1 ? new Discord.Attachment(link.attachments.first().url) : {})
        // Await is needed because the bot might delete the message before it's finally sent. Yes, the bot is that fast. ~ Zerinho6
        if (link.embeds.length >= 1) {
          if (!link.channel.permissionsFor(this.client.user.id).has('EMBED_LINKS')) throw new CommandError(t('commands:move.cantSendEmbed'));

          ['fields', 'title', 'description', 'url', 'timestamp', 'color', 'image', 'thumbnail', 'author'].forEach(p => {
            embed[p] = link.embeds[0][p]
          })
          // Thanks for the suggestion, mete. ~ Zerinho6

          await destinationChannel.send(embed)
          // Same reason in line 34
        }
        link.delete()
      } catch (e) {
        throw new CommandError(t('commands:move.couldntSendMessage'))
      }
    } catch (e) {
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
