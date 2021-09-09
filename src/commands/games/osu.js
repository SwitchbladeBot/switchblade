const { SubcommandListCommand } = require('../../')

module.exports = class Osu extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'osu',
      category: 'games',
      requirements: { apis: ['osu'] },
      authorString: 'commands:osu.gameName',
      authorImage: 'https://i.imgur.com/Ek0hnam.png',
      authorURL: 'https://osu.ppy.sh',
      embedColor: '#E7669F'
    }, client)

    this.modes = {
      osu: ['0', 'osu!'],
      taiko: ['1', 'osu!taiko'],
      catchthebeat: ['2', 'osu!catch'],
      mania: ['3', 'osu!mania']
    }
  }
}
