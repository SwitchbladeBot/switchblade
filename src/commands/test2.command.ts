import { CommandInteraction } from 'discord.js';
import { Command } from '../common/command/Command';
import CommandHandler from '../common/command/CommandHandler';
import LocalisationModule from '../modules/common/localisation.module';

export default class TestCommand extends Command {
    constructor(
        handler: CommandHandler,
        _: any,
    ) {
        super(handler, {
            name: 'test2',
            guild: '445203868624748555',
            command: {
                name: 'test-me-again',
                description: 'A simple test command, but again',
                // options: [
                //     {
                //         type: 'STRING',
                //         name: 'locale',
                //         description: 'Locale for testing. en-US or pt-BR',
                //     },
                // ],
            },
        });
    }

    async exec(interaction: CommandInteraction) {
        const language = interaction.options.getString('locale');

        const localisationModule = this.main.commonModulesHandler.getModule(LocalisationModule)!;

        const t = localisationModule.i18n.getFixedT(language ?? 'en-US');

        return interaction.reply({
            content: t('common:hello'),
            ephemeral: true,
        });
    }
}
