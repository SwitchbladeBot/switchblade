const { Command, SwitchbladeEmbed, CommandError } = require('../../')
const axios = require('axios')
const waifuAPI = 'https://waifu.pics/api/'

module.exports = class Waifu extends Command {
  constructor(client) {
    super({
      name: 'waifu',
      category: 'anime'
    }, client)
  }

  async run({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd waifu if the channel is NSFW
    const endpoint = channel.nsfw ? 'nsfw' : 'sfw'

    const response = await axios.get(waifuAPI + endpoint)
      .catch(() => {
        throw new CommandError(t('errors:generic'));
      });

    embed.setImage(response.data.url)
      .setDescription(t('commands:waifu.hereIsYour', { context: endpoint }))
    channel.send(embed).then(() => channel.stopTyping());

  }
}
