const { Command, SwitchbladeEmbed } = require('../../')

const getRandom = (r) => r[Math.floor(Math.random() * r.length)]
const getRandomPhoto = (r) => r[Math.floor(Math.random() * (r.length - 1)) + 1]
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

module.exports = class Pusheen extends Command {
  constructor (client) {
    super({
      name: 'pusheen',
      requirements: { apis: ['tumblr'] }
    }, client)
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    const posts = await this.client.apis.tumblr.getPhotoPosts('pusheen', { offset: Math.floor(Math.random() * 155) })
    const randomPost = getRandom(posts.response.posts)
    const embed = new SwitchbladeEmbed(author)
      .setAuthor(posts.response.blog.title, `https://i.imgur.com/${getRandom(pusheenAvatars)}.png`, randomPost.post_url)
      .setImage(randomPost.photos.length < 2 ? randomPost.photos[0].original_size.url : getRandomPhoto(randomPost.photos).original_size.url)
      .setDescription(Math.random() > 0.99 ? t('commands:pusheen.hidden', { link: 'https://www.patreon.com/switchblade' }) : getRandom(pusheenMessages))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
