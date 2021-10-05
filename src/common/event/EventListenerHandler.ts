import { Collection } from 'discord.js';
import EventEmitter from 'events';
import { BaseHandler, IBaseHandlerOptions } from '../BaseHandler';
import { Main } from '../../Main';
import { EventListener } from './EventListener';

export interface IEventListenerHandlerOptions extends IBaseHandlerOptions {
}

export default class EventListenerHandler extends BaseHandler<EventListener> {
    public sources: Collection<string, EventEmitter>;

    constructor(
        main: Main,
        options: IEventListenerHandlerOptions,
    ) {
        super(main, options);

        this.sources = new Collection<string, EventEmitter>();
    }

    public use(source: EventEmitter, friendlyName: string): this {
        if (this.sources.get(friendlyName)) {
            throw new Error(`Source ${source.constructor.name} is already being used`);
        }

        this.sources.set(source.constructor.name, source);

        return this;
    }
}
