const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class PaginatedEmbed extends Command {
  constructor (client) {
    super(client, {
      name: 'paginatedembed',
      category: 'developers',
      hidden: true,
      requirements: { devOnly: true },
    })
  }

  async run ({ t, message }, author) {
    const PaginatedEmbed = new SwitchbladeEmbed.PaginatedEmbed(t)
    PaginatedEmbed
      .addPage(new SwitchbladeEmbed(author).setTitle('owo page one').setDescription('skip to the next one'))
      .addPage(new SwitchbladeEmbed(author).setTitle('goteem').setImage('https://png.pngtree.com/element_origin_min_pic/17/07/31/1751bed6d1682d8ffaedf3a29d5f3981.jpg'))
      .run(await message.channel.send('owo'))
  }
}
