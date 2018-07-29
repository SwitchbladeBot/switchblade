const { CommandStructures, SwitchbladeEmbed } = require('../../')
    const { Command } = CommandStructures
    const snekfetch = require('snekfetch')


    module.exports = class Shiba extends Command {
      constructor (client) {
        super(client)
        this.name = 'shiba'
        this.aliases = ['shibainu, doge']
      }

     async run ({ t, author, channel }) {
        const embed = new SwitchbladeEmbed(author)
        channel.startTyping()
        const { body } = await snekfetch.get('http://shibe.online/api/shibes')
        embed.setDescription(`${t('commands:shiba.hereIsYourShiba')} <:DoggoF:445701839564963840>`)
        embed.setImage(body[0])
        channel.send(embed).then(() => channel.stopTyping())
        }
      }
