const { Command, SwitchbladeEmbed } = require('../../')
const axios = require('axios');

const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class Neko extends Command {
  constructor(client) {
    super({
      name: 'neko',
      aliases: ['nekogirl'],
      category: 'anime'
    }, client)
  }

  async run({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd neko if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewd' : 'neko'

    const response = await axios.get(nekoAPI + endpoint)
      .catch(() => {
        throw new CommandError(t('errors:generic'));
      });

    embed.setImage(response.data.url)
      .setDescription(t('commands:neko.hereIsYour', { context: endpoint }))
    channel.send(embed).then(() => channel.stopTyping());

  }
}
