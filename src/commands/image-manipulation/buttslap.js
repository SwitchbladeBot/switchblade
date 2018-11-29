const { CommandStructures, CanvasTemplates } = require('../../');
const { Command, CommandParameters, UserParameter } = CommandStructures;
const { Attachment } = require('discord.js');

class ButtSlap extends Command {
    constructor(client) {
        super(client);
        this.aliases = ['slap'];
        this.parameters = new CommandParameters(this, 
            new UserParameter({ acceptBot: true, acceptSelf: false, missingError: 'commands:buttslap.noMentions' }),
            new ({ acceptBot: true, acceptSelf: true, required: false })
            );
    }

    async run({ t, channel, author }, tom, kettin) {
        try {

            // ._.
            if (!kettin) {
                kettin = tom;
                tom = author;
            };

            channel.startTyping();

            let stream = await CanvasTemplates.ButtSlap(tom.displayAvatarURL, kettin.displayAvatarURL);
            let attachment = new Attachment(stream, "image.gif");
            
            await channel.send({
                content: t('commnads:buttslap.sucess', { _tom: tom, _kettin: kettin }),
                files: [ attachment ]
            });

        } catch(err) {
            console.error(err);
        } finally {
            channel.stopTyping();
        }
    }
}

module.exports = ButtSlap;