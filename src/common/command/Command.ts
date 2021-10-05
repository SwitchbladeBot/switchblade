import CommandHandler from './CommandHandler';
import {
    ApplicationCommand,
    ChatInputApplicationCommandData,
    ApplicationCommandManager,
    CommandInteraction,
    GuildResolvable,
    Snowflake,
} from 'discord.js';
import { BaseModule, IBaseModuleOptions } from '../BaseModule';
import { ICommandContext } from './CommandContext';


export interface ICommandOptions extends IBaseModuleOptions{
    guild?: Snowflake | null;
    command: ChatInputApplicationCommandData
}

export class Command extends BaseModule {
    declare public readonly handler: CommandHandler;
    public readonly manager: ApplicationCommandManager;

    public command?: ApplicationCommand<{ guild?: GuildResolvable }>;
    public readonly guild?: Snowflake | null;
    public options: ChatInputApplicationCommandData;

    constructor(
        handler: CommandHandler,
        options: ICommandOptions,
    ) {
        super(handler, options);

        this.manager = handler.manager!;
        this.guild = options.guild;
        this.options = options.command;
    }

    async exec(interaction: CommandInteraction, context: ICommandContext): Promise<any> {
        throw new Error(`Command ${this.constructor} has no executable`);
    }

    get _name(): string {
        return `${this.guild ?? 'global'}-${this.name}`;
    }

    get commandJSON(): ChatInputApplicationCommandData {
        return {
            name: this.options.name,
            description: this.options?.description,
            defaultPermission: this.options.defaultPermission,
            options: this.options?.options,
        };
    }

    async init(reload: boolean, command: ApplicationCommand): Promise<void> {
        super.init(reload);

        this.command = command;
    }
}
