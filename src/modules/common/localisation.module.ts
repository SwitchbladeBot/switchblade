import { i18n } from 'i18next';
import { BaseModule } from '../../common/BaseModule';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { readdirSync } from 'fs';

export default class LocalisationModule extends BaseModule {
    public name: string = 'localisation';
    public i18n: i18n = i18next
    public nameSpaces = ['common']

    async onLoad() {
        await this.initI18n();
        this.logger.debug(this.i18n.t('common:hello'));
    }

    async initI18n(): Promise<void> {
        const localePath = path.resolve(__dirname, '../../locales');
        const languages = readdirSync(localePath);
        return new Promise((resolve) => {
            this.i18n
                .use(Backend)
                .init({
                    ns: this.nameSpaces,
                    load: 'all',
                    preload: languages,
                    fallbackLng: 'en-US',
                    backend: {
                        loadPath: path.resolve(localePath, '{{lng}}/{{ns}}.json'),
                    },
                    interpolation: {
                        escapeValue: false,
                    },
                    returnEmptyString: false,
                    debug: true,
                }, (error) => {
                    if (error) {
                        this.logger.error('Could not load locales:', error);
                    }
                    resolve();
                });
        });
    }
}
