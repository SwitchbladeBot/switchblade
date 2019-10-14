const {Command, SwitchbladeEmbed, Constants} = require('../../');

module.exports = class CreateRole extends Command {
    constructor (client){
        super(client, {
            name: 'createrole',
            category: 'moderation',
            requirements : {guildOnly: true, botPermissions: ["MANAGE_ROLES"], permissions: ["MANAGE_ROLES"]},
            parameters: [
                {type: 'color', missingError: 'commands:createrole.noParams'},
                {type: 'string', full: true, missingError: 'commands:createrole.noParams'}
            ]

        })
    }

    async run ({ channel, guild, author, t}, color, name){
        const hexcode = color.rgb(true)
        const embed = new SwitchbladeEmbed(author)
        await guild.createRole({name: name, color:hexcode}).then(role => {
            embed
                .setTitle(t('commands:createrole.successTitle'))
                .setDescription(`Name of the role: ${name}`)
                .setColor(hexcode)
        }).catch(err => {
            embed
                .setColor(Constants.ERROR_COLOR)
                .setTitle(t('commands:createrole.errorTitle'))
                .setDescription(`\`${err}\``)
        })
        channel.send(embed)
    }
}