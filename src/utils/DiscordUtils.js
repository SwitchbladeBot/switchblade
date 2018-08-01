module.exports = class DiscordUtils {
  static async lastImageFromChannel (channel) {
    const channelMessages = await channel.fetchMessages()
    const message = channelMessages.find(m => m.attachments.filter(a => a.height).first())
    if (message) {
      return message.attachments.first().url
    } else {
      return null
    }
  }
}