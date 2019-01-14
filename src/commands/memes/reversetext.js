const { CommandStructures, SwitchbladeEmbed } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class ReverseText extends Command {
    constructor (client) {
        super(client)
        this.name = 'reversetext'
        this.category = 'memes'

        this.parameters = new CommandParameters(this,
            new StringParameter({ full: true, missingError: 'commands:reversetext.missingSentence' })
        )
    }

    async run ({ t, author, channel }, text) {
        channel.send(
            new SwitchbladeEmbed(author)
                .setDescription(`${text.split('').reverse().join('')}`)
        )
    }
}
