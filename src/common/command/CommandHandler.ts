import { ApplicationCommand, ApplicationCommandData, ApplicationCommandManager, Interaction } from 'discord.js';
import { Command } from './Command';
import requireall from 'require-all';
import { BaseHandler, IBaseHandlerOptions } from '../BaseHandler';
import { Main } from '../../Main';
import { ICommandContext } from './CommandContext';
import LocalisationModule from '../../modules/common/localisation.module';

export interface ICommandHandlerOptions extends IBaseHandlerOptions {
}

export type TCommand = {
    command?: ApplicationCommand,
    file?: Command
}

export default class CommandHandler extends BaseHandler<Command> {
    public manager?: ApplicationCommandManager;

    constructor(
        main: Main,
        options: ICommandHandlerOptions,
    ) {
        super(main, options);
    }

    /*  public async load(module: Command, reload: boolean = false) {
        if (!this.client) {
            this.logger.error('Client not set.');
            throw new Error('Client not set.');
        }
        if (!this.manager) {
            this.logger.error('ApplicationCommandManager not set.');
            throw new Error('ApplicaitonCommandManager not set.');
        }

        const entry = this._commands
        .find((c) => c.command?.name === module.name && (!!module.guild ? c.command.guildId === module.guild : true))
        || {};

        try {
            if (!entry.command) {
                entry.command = await (
                    module.guild
                        ? this.manager.create(module.commandJSON, module.guild)
                        : this.manager.create(module.commandJSON)
                );
            } else if (!module._ready || reload) {
                entry.command = await (
                    module.guild
                        ? this.manager.edit(entry.command.id, module.commandJSON, module.guild)
                        : this.manager.edit(entry.command.id, module.commandJSON)
                );
            }
            this._commands.set(entry.command.id, { command: entry.command, file: module });
            module.init(reload, entry.command);
        } catch (err) {
            throw new Error(`Error during command ${reload ? 're' : ''}load: ${err}`);
        }

        if (this.modules.has(module._name) && !reload) {
            this.logger.error(`Module ${module._name} already loaded.`);
            throw new Error(`Module ${module._name} already loaded.`);
        } else if (!this.modules.has(module._name) && reload) {
            this.logger.error(`Module ${module._name} is impossible to reload, it is not loaded.`);
            throw new Error(`Module ${module._name} is impossible to reload, it is not loaded.`);
        }

        await module.onLoad(reload);
        if (reload) {
            this.modules.delete(module._name);
        }
        this.modules.set(module._name, module);

        this.logger.info({ scope: '[Switchblade]', message: `Module ${module._name} loaded.` });
        this.emit('load', module, reload);
    } */

    public async loadAll() {
        if (!this.client) {
            throw this.logger.error(new Error('Module - Client not set'));
        }
        if (!this.manager) {
            throw new Error('CommandHandler: manager is not set');
        }
        const modules: Command[] = [];

        const entries = await Object.entries(requireall({
            dirname: this.options.directory,
            filter: this.options.filter ?? /(.+module)\.(js|ts)$/,
            recursive: true,
        }));

        for (const entry of entries) {
            try {
                if (!entry[1].default) throw new Error('Module is not exported at default');
                // eslint-disable-next-line new-cap
                const cmd = new entry[1].default(this, {});
                modules.push(cmd);
            } catch (e) {
                this.logger.error(`Could not load ${entry[0]} command.`, e);
            }
        }

        const groupedCommands = modules.reduce((r, a) => {
            const index = a.guild || 'global';
            r[index] = r[index] || [];
            r[index].push({
                module: a,
                json: a.commandJSON,
            });
            return r;
        }, Object.create(null)) as {
            [key: string]: {
                module: Command,
                json: ApplicationCommandData
            }[]
        };

        for (const [scope, commands] of Object.entries(groupedCommands)) {
            try {
                const res = await (
                    scope === 'global' ?
                        this.manager.set(commands.map((c) => c.json)) :
                        this.manager.set(commands.map((c) => c.json), scope)
                );

                for (const { module } of commands) {
                    const found = res.find((command) => command.name === module.options.name);
                    if (!found) {
                        throw new Error(`Module ${module.name} not found in ${scope} scope.`);
                    }
                    module.init(false, found);
                    this.modules.set(found?.id, module);
                }
            } catch (err) {
                throw this.logger.error(new Error(`Error during command load: ${err}`));
            }
        }

        // console.log(this.modules);
        /* for (const command of leftover) {
            if (command) {
                if (command.guildId) {
                    await this.manager.delete(command.id, command.guildId);
                } else {
                    await this.manager.delete(command.id);
                }
                this._commands.delete(command.id);
                this.logger.info(
                    `Leftover ${command.guildId? `guild (${command.guildId}) `: ''}command ${command.name} deleted.`
                    );
            }
        } */
    }

    public async handle(interaction: Interaction) {
        try {
            if (!interaction.isCommand()) {
                return;
            }

            const command = this.modules.find(
                (c) => !!c.command && c.command.id === interaction.commandId,
            );

            if (!command) {
                this.logger.error(`Command ${interaction.commandId} (${interaction.commandName}) not found`);
                throw new Error(`Command ${interaction.commandId} (${interaction.commandName}) not found`);
            }

            await command.exec(interaction, this.createContextFromInteraction(interaction));
        } catch (err) {
            this.emit('error', err);
        }
    }

    private createContextFromInteraction(interaction: Interaction): ICommandContext {
        console.log(interaction.guild?.preferredLocale);
        const localisationModule = this.main.commonModulesHandler.getModule(LocalisationModule)!;
        return {
            t: localisationModule.i18n.getFixedT(interaction.guild?.preferredLocale!) ?? localisationModule.i18n.t,
        };
    }

    public async init() {
        this.client.on(
            'interactionCreate',
            (interaction: Interaction) => this.handle(interaction),
        );

        if (!this.client.application) {
            this.logger.error(`Application is null`);
            throw new Error('Application is null');
        }
        this.manager = this.client.application!.commands;

        super.init();
    }
}
