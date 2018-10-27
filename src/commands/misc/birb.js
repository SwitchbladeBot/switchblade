const { Command, SwitchbladeEmbed } = require('../../')
const { Attachment } = require('discord.js')
const snekfetch = require('snekfetch')

module.exports = class Birb extends Command {
  constructor (client) {
    super(client)
    this.name = 'birb'
    this.category = 'general'
    this.aliases = ['bird', 'borb']
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    const { body } = await snekfetch.get('http://random.birb.pw/tweet/random')
    channel.send(new SwitchbladeEmbed().setDescription(t('commands:birb.hereIsYourBirb')).setImage('attachment://birb.png').attachFile(new Attachment(body, 'birb.png'))).then(() => channel.stopTyping())
  }
}
