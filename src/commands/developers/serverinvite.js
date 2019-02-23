const { CommandStructures } = require('../../');
const { Command, CommandRequirements, CommandParameters, StringParameter } = CommandStructures;

module.exports = class Serverinvite extends Command {
    constructor(client) {
        super(client);
        this.name = 'serverinvite';
        this.aliases = ['sinvite'];
        this.category = 'developers';
        this.hidden = true;
        
        this.requirements = new CommandRequirements(this, { devOnly: true });
        this.parameters = new CommandParameters(this, new StringParameter({ full: true, missingError: 'errors:missingParameters', showUsage: false }));
    }
    
    async run({ channel, message }, expr) {
        // Add permission handling here
        const guildID = expr; // Add args handling here
        if (!(guildID && message.client.guilds.has(guildID))) return message.channel.send(`Guild not found`);
        message.client.guilds.get(guildID).channels.filter((channel) => channel.permissionsFor(message.guild.me).has(1) && channel.type !== 'category').first().createInvite({ maxAge: 0 }).then((invite) => {
        message.channel.send(`Here's the invite: ${invite.url}`);
        }).catch((error) => {
                 return message.channel.send('I ran into an error: ' + error);
        });
    }
}
