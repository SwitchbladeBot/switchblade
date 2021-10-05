import {
    Client,
} from 'discord.js';
import { BaseHandler } from './BaseHandler';
import { Main } from '../Main';
import { Signale } from 'signale';

export interface IBaseModuleOptions {
    name: string;
}

export class BaseModule {
    public _ready: boolean = false;
    public readonly main: Main;
    public readonly client: Client;
    public readonly name: string;
    public readonly logger: Signale;

    constructor(
        public readonly handler: BaseHandler<BaseModule>,
        public readonly options: IBaseModuleOptions,
    ) {
        this.main = handler.main;
        this.client = handler.client;
        this.logger = handler.logger;
        this.name = options.name;
    }

    get _name(): string {
        return this.name;
    }

    async onLoad(isReload: boolean): Promise<void> { }
    async onUnload(): Promise<void> { }
    async onError(error: Error): Promise<void> { }

    async init(reload: boolean, ..._args: any): Promise<void> {
        if (this._ready && !reload) {
            throw new Error(`${this.name} is already initialized`);
        }

        this._ready = true;
    }
}
