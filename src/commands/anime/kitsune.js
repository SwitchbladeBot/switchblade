const { Command, SwitchbladeEmbed, CommandError } = require('../../')
const axios = require('axios');

const nekoAPI = 'https://nekos.life/api/v2/img/'


module.exports = class Kitsune extends Command {
  constructor(client) {
    super({
      name: 'kitsune',
      aliases: ['foxgirl'],
      category: 'anime'
    }, client)
  }

  async run({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd kitsune if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewdk' : 'fox_girl'

    const response = await axios.get(nekoAPI + endpoint)
      .catch(() => {
        throw new CommandError(t('errors:generic'));
      });

    embed.setImage(response.data.url)
      .setDescription(t('commands:kitsune.hereIsYour', { context: endpoint }))
    channel.send(embed).then(() => channel.stopTyping());

  }
}
