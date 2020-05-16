const { Command, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Move extends Command {
  constructor (client) {
    super({
      name: 'move',
      aliases: ['mover'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_MESSAGES'], permissions: ['MANAGE_MESSAGES'] },
      parameters: [{
        type: 'url', missingError: 'commands:move.missingMessageLink'
      }, {
        type: 'channel', onlySameGuild: true, acceptText: true, missingError: 'commands:move.missingChannelMention'
      }]
    }, client)
  }

  async run ({ channel, guild, author, t, message }, link, destinationChannel) {
    /*
    Bot has manage messages and user also has,
    so now we need to check those permissions in
    the channel he wants to move to.
    */
    const matchedLink = link.pathname.length > 1 ? link.pathname.match(/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/) : null
    const embed = new SwitchbladeEmbed(author)
    if (!matchedLink) {
      embed.setTitle(t('commands:move.invalidMessageLink'))
      embed.setDescription(t('commands:move.missingMessageLink'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    const guildId = matchedLink[1]
    const channelId = matchedLink[2]
    const messageId = matchedLink[3]

    if (guildId !== guild.id) {
      embed.setDescription(t('commands:move.onlyThisGuild'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    if (!guild.channels.has(channelId)) {
      embed.setDescription(t('commands:move.channelDoesntExist'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    const channelFrom = guild.channels.get(channelId)

    if (!channelFrom) {
      embed.setDescription(t('commands:move.couldntFindChannel'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    if (!destinationChannel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) {
      embed.setDescription(t('commands:move.cantSendInChannel'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    try {
      const recievedMessage = await channelFrom.fetchMessage(messageId)

      if (!recievedMessage) {
        embed.setDescription(t('commands:move.couldntFindMessage'))
        embed.setColor(Constants.ERROR_COLOR)
        channel.send(embed)
        return
      }
    } catch (e) {
      embed.setDescription(t('commands:move.couldntFindMessage'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    /*
    Doing this outside the try catch made the handler on line 71 get ignored.
    While doing this looks weird, but it works. ~ Zerinho6.
    */
    const recievedMessage = await channelFrom.fetchMessage(messageId)

    if (recievedMessage.channel.nsfw && !destinationChannel.nsfw) {
      embed.setDescription(t('commands:move.channelsHaveDifferentType'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    if (!recievedMessage.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) {
      embed.setDescription(t('commands:move.cantDeleteMessage'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    if (!recievedMessage.channel.permissionsFor(author.id).has('SEND_MESSAGES')) {
      embed.setDescription(t('commands:move.userCantSend'))
      embed.setColor(Constants.ERROR_COLOR)
      channel.send(embed)
      return
    }

    try {
      destinationChannel.send(`${t('commands:move.messageSentBy')} ${recievedMessage.author.username} ${t('commands:move.movedFrom')} ${recievedMessage.channel.name}  ${t('commands:move.by')} ${author.username}`)

      if (recievedMessage.content.length >= 1) {
        destinationChannel.send(recievedMessage.content)
      }

      if (recievedMessage.attachments.size >= 1) {
        const Discord = require('discord.js')
        destinationChannel.send(new Discord.Attachment(message.attachments.first().url))
      }
      recievedMessage.delete()

      if (recievedMessage.embeds.length > 1) {
        if (!recievedMessage.channel.permissionsFor(this.client.user.id).has('EMBED_LINKS')) {
          embed.setDescription(t('commands:move.cantSendEmbed'))
          embed.setColor(Constants.ERROR_COLOR)
          destinationChannel.send(embed)
          return
        }

        embed.fields = recievedMessage.embeds[0].fields
        embed.title = recievedMessage.embeds[0].title
        embed.description = recievedMessage.embeds[0].description
        embed.url = recievedMessage.embeds[0].url
        embed.timestamp = recievedMessage.embeds[0].timestamp
        embed.color = recievedMessage.embeds[0].color
        embed.video = recievedMessage.embeds[0].video
        embed.image = recievedMessage.embeds[0].image
        embed.thumbnail = recievedMessage.embeds[0].thumbnail
        embed.author = recievedMessage.embeds[0].author

        /*
        Wonder why I don't do embed = recievedMessage.embeds[0] ?
        Well, try it yourself, I've been trying all day to get it
        working, but somehow it's a empty message, says d.js ~ Zerinho6
        */
        destinationChannel.send(embed)
        recievedMessage.delete()
      }
    } catch (e) {
      embed.setDescription(t('commands:move.couldntSendMessage'))
      embed.setColor(Constants.ERROR_COLOR)
      destinationChannel.send(embed)
    }
  }
}
