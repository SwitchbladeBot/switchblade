import EventEmitter from 'events';
import { Main } from '../Main';
import requireall from 'require-all';
import { BaseModule, IBaseModuleOptions } from './BaseModule';
import { Client, Collection } from 'discord.js';
import { Signale } from 'signale';

export interface IBaseHandlerOptions {
    directory: string;
    filter?: RegExp
}

export interface ModuleConstructor<TModule extends BaseModule> {
    new(handler: BaseHandler<BaseModule>, options: IBaseModuleOptions): TModule
}

export class BaseHandler<TModule extends BaseModule> extends EventEmitter {
    private _ready = false;
    public readonly client: Client;
    public modules = new Collection<string, TModule>();
    public readonly logger: Signale

    constructor(
        public readonly main: Main,
        public readonly options: IBaseHandlerOptions,
    ) {
        super();

        this.client = main.discord;
        this.logger = main.logger;
    }

    public async load(module: TModule, reload: boolean = false) {
        if (!this.client) {
            throw this.logger.error(new Error('Module - Client not set'));
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

        this.logger.info(`Module ${module._name} loaded.`);
        this.emit('load', module, reload);
    }

    public async loadAll() {
        if (!this.client) {
            throw this.logger.error(new Error('Module - Client not set'));
        }

        const modules = await Object.entries(requireall({
            dirname: this.options.directory,
            filter: this.options.filter ?? /(.+module)\.(js|ts)$/,
            recursive: true,
        // eslint-disable-next-line new-cap
        })).map((entry: [string, any]) => new entry[1].default(this, {})) as TModule[];

        for (const entry of modules) {
            await this.load(entry);
        }
    }

    public async init() {
        try {
            if (this._ready) {
                throw this.logger.error(new Error('Module - Handler already initialized'));
            }
            this._ready = true;

            await this.loadAll();

            this.emit('init');
        } catch (err) {
            this._ready = false;
            throw err;
        }
    }

    public getModule<M extends TModule>(module: ModuleConstructor<M>): M | undefined {
        for (const [, mod] of this.modules) {
            if (mod instanceof module) {
                return mod;
            }
        }
        return undefined;
    }
}
