import { CommandInteraction } from "discord.js";
import { Command } from "../common/command/Command";
import { CommandHandler } from "../common/command/CommandHandler";

export default class TestCommand extends Command {
    constructor(
        handler: CommandHandler,
        _: any
    ) {
        super(handler, {
            name: "test",
            guild: "445203868624748555",
            command: {
                name: "test-me",
                description: "A simple test command"
            }
        });
    }

    async exec(interaction: CommandInteraction) {
        return interaction.reply({
            content: 'Howdy partner!',
            ephemeral: true
        });
    }
}