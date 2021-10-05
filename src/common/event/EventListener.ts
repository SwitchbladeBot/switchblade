import {
    CommandInteraction,
} from 'discord.js';
import { BaseModule, IBaseModuleOptions } from '../BaseModule';
import EventListenerHandler from './EventListenerHandler';


export interface IEventListenerOptions extends IBaseModuleOptions {
    source: string;
    event: string;
}

export class EventListener extends BaseModule {
    declare public readonly handler: EventListenerHandler;

    public readonly source: string;
    public readonly event: string;

    constructor(
        handler: EventListenerHandler,
        options: IEventListenerOptions,
    ) {
        super(handler, options);

        this.source = options.source;
        this.event = options.event;
    }

    async exec(interaction: CommandInteraction): Promise<any> {
        throw new Error(`Not implemented`);
    }

    get _name(): string {
        return `${this.source}-${this.event}-${this.name}`;
    }
}
