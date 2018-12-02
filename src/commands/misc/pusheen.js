const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Pusheen extends Command {
  constructor (client) {
    super(client)
    this.name = 'pusheen'
    this.category = 'general'
    this.requirements = new CommandRequirements(this, { apis: ['tumblr'] })
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    const getRandom = (r) => r[Math.floor(Math.random() * r.length)]
    const pusheenAvatars = [
      'Ih84hUP',
      'kO0L435',
      'tyOm4cb',
      '8AHt1g4',
      '3iqrRUo',
      'EaQlpvI',
      'jG2SFTz'
    ]
    const pusheenMessages = [
      '=^● ⋏ ● ^=',
      '/ᐠ｡ꞈ｡ᐟ\\',
      'ฅ/ᐠ｡ᆽ｡ᐟ \\',
      '(≈ㅇᆽㅇ≈)♡',
      'ก₍⸍⸌̣ʷ̣̫⸍̣⸌₎ค',
      '*:･ﾟ✧(=✪ ᆺ ✪=)*:･ﾟ✧',
      '（＾・ﻌ・＾✿）',
      '（ฅ＾・ﻌ・＾）ฅ',
      '=^._.^= ∫',
      '(^._.^)= ﾉ',
      '(^・x・^)',
      '(=♡ ᆺ ♡=)',
      '(=◕ᆽ◕ฺ=)'
    ]
    const posts = await this.client.apis.tumblr.getPhotoPosts('pusheen.com')
    const randomPost = getRandom(posts.response.posts)
    const embed = new SwitchbladeEmbed(author)
      .setAuthor(posts.response.blog.title, `https://i.imgur.com/${getRandom(pusheenAvatars)}.png`, randomPost.post_url)
      .setImage(randomPost.photos[0].original_size.url)
      .setDescription(Math.random() > 0.99 ? t('commands:pusheen.hidden', { link: 'https://www.patreon.com/switchblade' }) : getRandom(pusheenMessages))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
