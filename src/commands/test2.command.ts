import { CommandInteraction } from "discord.js";
import { Command } from "../common/command/Command";
import { CommandHandler } from "../common/command/CommandHandler";

export default class TestCommand extends Command {
    constructor(
        handler: CommandHandler,
        _: any
    ) {
        super(handler, {
            name: "test2",
            guild: "445203868624748555",
            command: {
                name: "test-me-again",
                description: "A simple test command, but again"
            }
        });
    }

    async exec(interaction: CommandInteraction) {
        return interaction.reply({
            content: 'Howdy again partner!',
            ephemeral: true
        });
    }
}