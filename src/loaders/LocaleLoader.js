const { Loader, FileUtils } = require('../')

const i18next = require('i18next')
const translationBackend = require('i18next-node-fs-backend')

module.exports = class LocaleLoader extends Loader {
  constructor (client) {
    super({}, client)

    this.cldr = { languages: {} }
  }

  async load () {
    try {
      await this.downloadAndInitializeLocales()
      this.client.i18next = i18next
      this.client.cldr = this.cldr
      return true
    } catch (e) {
      this.client.logger.error(e)
    }
    return false
  }

  /**
   * Initializes i18next.
   * @param {string} dirPath - Path to the locales directory
   */
  async downloadAndInitializeLocales (dirPath = 'src/locales') {
    if (this.client.apis.crowdin) {
      this.client.logger.info({ tag: 'Localization' }, 'Downloading locales from Crowdin')
      try {
        await this.client.apis.crowdin.downloadToPath(dirPath)
        this.client.logger.info({ tag: 'Localization' }, 'Locales downloaded')
      } catch (e) {
        this.client.logger.warn({ tag: 'Localization' }, 'Couldn\'t download locales - An error ocurred.')
        this.client.logger.error({ tag: 'Localization' }, e)
      }
    } else {
      this.client.logger.warn({ tag: 'Localization' }, 'Couldn\'t download locales - API wrapper didn\'t load.')
    }

    const dir = await FileUtils.readdir(dirPath)

    return new Promise((resolve) => {
      try {
        i18next.use(translationBackend).init({
          ns: ['categories', 'commands', 'commons', 'errors', 'music', 'permissions', 'regions', 'moderation', 'lolservers', 'languages', 'countries', 'game'],
          preload: dir,
          fallbackLng: 'en-US',
          backend: {
            loadPath: `${dirPath}/{{lng}}/{{ns}}.json`
          },
          interpolation: {
            escapeValue: false
          },
          returnEmptyString: false
        }, () => {
          resolve(this.loadLanguagesDisplayNames(Object.keys(i18next.store.data)))
          this.client.logger.info({ tag: 'Localization' }, 'i18next initialized')
        })
      } catch (e) {
        this.client.logger.error(e)
      }
    })
  }

  /**
   * Loads language display names
   * @param {Array} codes
   */
  async loadLanguagesDisplayNames (codes) {
    const lw = (s) => s.toLowerCase()
    const langs = codes.reduce((o, l) => { o[l] = {}; return o }, {})
    codes.forEach(lc => {
      const [language] = lc.split('-')
      try {
        const { main } = require(`cldr-localenames-modern/main/${language}/languages`)
        const display = main[language].localeDisplayNames.languages
        codes.forEach(l => {
          const langObj = langs[l][lc] = []
          const [lcode] = l.split('-')
          if (codes.filter(c => c.startsWith(lcode)).length === 1 && display[lcode]) {
            langObj.push(lw(display[lcode]))
          }
          if (display[l]) langObj.push(lw(display[l]))
        })
      } catch (e) {}
    })
    this.cldr.languages = langs
    return langs
  }
}
