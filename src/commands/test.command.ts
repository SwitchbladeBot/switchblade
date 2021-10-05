import { CommandInteraction } from 'discord.js';
import { Command } from '../common/command/Command';
import { ICommandContext } from '../common/command/CommandContext';
import CommandHandler from '../common/command/CommandHandler';

export default class TestCommand extends Command {
    constructor(
        handler: CommandHandler,
        _: any,
    ) {
        super(handler, {
            name: 'test',
            guild: '445203868624748555',
            command: {
                name: 'test-me',
                description: 'A simple test command',
            },
        });
    }

    exec(interaction: CommandInteraction, context: ICommandContext) {
        return interaction.reply({
            content: `Uepa! This guild's default language is ${interaction.guild?.preferredLocale}.`,
            embeds: [
                {
                    title: context.t('common:hello') ?? 'uepa algo deu errado',
                },
            ],
            ephemeral: true,
        });
    }
}
