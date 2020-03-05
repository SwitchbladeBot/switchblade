const { Loader, APIWrapper, FileUtils } = require('../')

module.exports = class APILoader extends Loader {
  constructor (client) {
    super({}, client)

    this.apis = {}
  }

  async load () {
    try {
      await this.initializeAPIs()
      this.client.apis = this.apis
      return true
    } catch (e) {
      this.logError(e)
    }
    return false
  }

  /**
   * Initializes all API Wrappers.
   * @param {string} dirPath - Path to the apis directory
   */
  async initializeAPIs (dirPath = 'src/apis') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, async (NewAPI) => {
      if (Object.getPrototypeOf(NewAPI) !== APIWrapper) return
      await this.addAPI(new NewAPI()) ? success++ : failed++
    }, this.logError.bind(this)).then(() => {
      if (failed) this.log(`${success} API wrappers loaded, ${failed} failed.`, { color: 'yellow', tags: ['APIs'] })
      else this.log(`All ${success} API wrappers loaded without errors.`, { color: 'green', tags: ['APIs'] })
    })
  }

  /**
   * Adds a new API Wrapper to the Client.
   * @param {APIWrapper} api - API Wrapper to be added
   */
  async addAPI (api) {
    if (!(api instanceof APIWrapper)) {
      this.log(`${api.name} failed to load - Not an APIWrapper`, { color: 'red', tags: ['APIs'] })
      return false
    }

    if (api.canLoad() !== true) {
      this.log(`${api.name} failed to load - ${api.canLoad() || 'canLoad function did not return true.'}`, { color: 'red', tags: ['APIs'] })
      return false
    }

    if (!api.envVars.every(variable => {
      if (!process.env[variable]) this.log(`${api.name} failed to load - Required environment variable "${variable}" is not set.`, { color: 'red', tags: ['APIs'] })
      return !!process.env[variable]
    })) return false

    this.apis[api.name] = await api.load()
    return true
  }
}
