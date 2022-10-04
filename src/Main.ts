import { Client } from "discord.js"
import { Signale } from "signale"
import { CommandHandler } from "./common/command/CommandHandler";
import path from "path";
import { EventListenerHandler } from "./common/event/EventListenerHandler";

export class Main {
    public logger: Signale;
    public discord: Client;
    public eventHandler: EventListenerHandler;
    public commandHandler: CommandHandler;
    
    constructor () {
        this.logger = new Signale({ scope: 'Switchblade' });
        
        this.discord = new Client({
            intents: [
                "GUILDS"
            ]
        });
        
        this.eventHandler = new EventListenerHandler(this, {
            directory: path.join(__dirname, "listeners"),
            filter: /(.+listener)\.(js|ts)$/
        });
        
        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, "commands"),
            filter: /(.+command)\.(js|ts)$/
        });
    }
    
    async init () {
        const loading = new Signale({ interactive: true, scope: 'Switchblade' })
        loading.await('[%d/1] - Waiting for EventHandler', 1)
        await this.eventHandler
            .use(process, 'process')
            .use(this.eventHandler, 'eventHandler')
            .use(this.discord, 'client')
            .use(this.commandHandler, 'commandHandler')
            .init()
            .then(() => loading.success('[%d/4] EventListener handler initializated', 2))
        
        await this.discord.login(process.env.DISCORD_TOKEN).then(() => loading.success('[%d/4] Login successful', 3))
        await this.commandHandler.init().then(() => loading.success('[%d/4] Command handler initializated', 4))
    }
}
