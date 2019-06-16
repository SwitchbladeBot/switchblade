const { Loader, FileUtils } = require('../')

const i18next = require('i18next')
const translationBackend = require('i18next-node-fs-backend')

module.exports = class LocaleLoader extends Loader {
  constructor (client) {
    super(client)

    this.cldr = { languages: {} }
  }

  async load () {
    try {
      await this.downloadAndInitializeLocales()
      this.client.i18next = i18next
      this.client.cldr = this.cldr
      return true
    } catch (e) {
      this.client.logger.error(e, { label: this.constructor.name })
    }
    return false
  }

  /**
   * Initializes i18next.
   * @param {string} dirPath - Path to the locales directory
   */
  downloadAndInitializeLocales (dirPath = 'src/locales') {
    return new Promise(async (resolve, reject) => {
      if (this.client.apis.crowdin) {
        this.client.logger.debug('Downloading locales from Crowdin', { label: this.constructor.name })
        try {
          await this.client.apis.crowdin.downloadToPath(dirPath)
          this.client.logger.info('Locales downloaded', { label: this.constructor.name })
        } catch (e) {
          this.client.logger.error(e, { label: this.constructor.name })
        }
      } else {
        this.client.logger.debug('Could not download locales from Crowdin', { reason: 'API wrapper didn\'t load', label: this.constructor.name })
      }

      try {
        i18next.use(translationBackend).init({
          ns: [ 'categories', 'commands', 'commons', 'errors', 'music', 'permissions', 'regions', 'moderation', 'lolservers', 'languages' ],
          preload: await FileUtils.readdir(dirPath),
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
          this.client.logger.info('i18next initialized', { label: this.constructor.name })
        })
      } catch (e) {
        this.client.logger.error(e, { label: this.constructor.name })
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
      let [ language ] = lc.split('-')
      try {
        const { main } = require(`cldr-localenames-modern/main/${language}/languages`)
        const display = main[language].localeDisplayNames.languages
        codes.forEach(l => {
          const langObj = langs[l][lc] = []
          let [ lcode ] = l.split('-')
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
