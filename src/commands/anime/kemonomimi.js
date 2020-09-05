const { Command, SwitchbladeEmbed, CommandError } = require('../../')
const axios = require('axios');

const nekoAPI = 'https://nekos.life/api/v2/img/';

module.exports = class Kemonomimi extends Command {
  constructor(client) {
    super({
      name: 'kemonomimi',
      category: 'anime'
    }, client)
  }

  async run({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd kemonomimi if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewdkemo' : 'kemonomimi'
    
    const response = await axios.get(nekoAPI + endpoint)
    .catch(() => {
      throw new CommandError(t('errors:generic'));
    });

    embed.setImage(response.data.url)
      .setDescription(t('commands:kemonomimi.hereIsYour', { context: endpoint }))
    channel.send(embed).then(() => channel.stopTyping());

  }
}
