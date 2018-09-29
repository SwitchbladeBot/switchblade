const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Changelog extends Command {
  constructor (client) {
    super(client)
    this.name = 'changelog'
    this.aliases = ['commits']
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get('https://api.github.com/repos/switchbladebot/switchblade/commits')
    const commits = body.slice(0, 10)
    embed.setTitle(`[switchblade:dev] Latest 10 commits`)
  		.setURL(`https://github.com/switchbladebot/switchblade/commits/dev`)
  		.setDescription(commits.map(c => {
  			let h = `[\`${c.sha.slice(0, 7)}\`](${c.html_url})`
  			return `${h} ${this.shorten(c.commit.message.split('\n')[0], 50)} - ${c.author.login}`
  		}).join('\n'))
    channel.send(embed).then(() => channel.stopTyping())
  }

  shorten (text, max) {
    return text.length > max ? `${text.substr(0, max - 3)}...` : text
  }
}
