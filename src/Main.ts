import { Client } from 'discord.js';
import { Signale } from 'signale';
import path from 'path';
import CommonModulesHandler from './modules/CommonModulesHandler';
import EventListenerHandler from './common/event/EventListenerHandler';
import CommandHandler from './common/command/CommandHandler';

export class Main {
    public logger: Signale;
    public discord: Client;
    public eventHandler: EventListenerHandler;
    public commandHandler: CommandHandler;
    public commonModulesHandler: CommonModulesHandler;

    constructor() {
        this.logger = new Signale({ scope: 'Switchblade' });

        this.discord = new Client({
            intents: [
                'GUILDS',
            ],
        });

        this.eventHandler = new EventListenerHandler(this, {
            directory: path.join(__dirname, 'listeners'),
            filter: /(.+listener)\.(js|ts)$/,
        });

        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, 'commands'),
            filter: /(.+command)\.(js|ts)$/,
        });

        this.commonModulesHandler = new CommonModulesHandler(this, {
            directory: path.join(__dirname, 'modules', 'common'),
            filter: /(.+module)\.(js|ts)$/,
        });
    }

    async init() {
        const loading = new Signale({ interactive: true, scope: 'Switchblade' });
        loading.await('[%d/1] - ta ligando', 1);
        await this.eventHandler
            .use(process, 'process')
            .use(this.eventHandler, 'eventHandler')
            .use(this.discord, 'client')
            .use(this.commonModulesHandler, 'commonModulesHandler')
            .use(this.commandHandler, 'commandHandler')
            .init()
            .then(() => loading.success('[%d/4] EventListener handler initializated', 2));

        await this.discord.login(process.env.DISCORD_TOKEN).then(() => loading.success('[%d/5] Login successful', 3));
        await this.commonModulesHandler.init()
            .then(() => loading.success('[%d/5] Common modules handler initializated', 4));
        await this.commandHandler.init()
            .then(() => loading.success('[%d/5] Command handler initializated', 5));
    }
}
